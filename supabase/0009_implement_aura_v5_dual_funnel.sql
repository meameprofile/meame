-- RUTA: supabase/migrations/0009_implement_aura_v5_dual_funnel.sql
/**
 * @file 0009_implement_aura_v5_dual_funnel.sql
 * @description Implementa la arquitectura de doble embudo para "Aura" v5.0.
 *              - Crea tablas para tracking de actividad de usuarios registrados.
 *              - Renombra tablas existentes para mayor claridad semántica.
 *              - Crea una nueva función de agregación para las analíticas de usuario.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

BEGIN;

-- =================================================================
-- FASE 1: INFRAESTRUCTURA PARA ANALÍTICAS DE USUARIO (CREADORES)
-- =================================================================

CREATE TABLE IF NOT EXISTS public.user_activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- ej: 'login', 'logout', 'draft_saved', 'template_created'
    payload JSONB -- ej: { duration_ms: 3600000, page: '/creator/campaign-suite' }
);
COMMENT ON TABLE public.user_activity_events IS 'Almacena eventos de actividad de los usuarios registrados dentro de la plataforma.';

-- Índices para optimizar consultas de actividad
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_workspace_id ON public.user_activity_events(workspace_id);

-- =================================================================
-- FASE 2: CLARIDAD SEMÁNTICA PARA ANALÍTICAS DE VISITANTES
-- =================================================================

-- Renombrar la tabla 'campaign_events' para reflejar que son eventos de VISITANTES
ALTER TABLE IF EXISTS public.campaign_events RENAME TO visitor_campaign_events;
COMMENT ON TABLE public.visitor_campaign_events IS 'Almacena eventos de comportamiento de visitantes (clientes) en las campañas.';


-- =================================================================
-- FASE 3: NUEVAS FUNCIONES DE AGREGACIÓN
-- =================================================================

-- Nueva función para obtener analíticas de la actividad de un USUARIO
CREATE OR REPLACE FUNCTION get_user_activity_analytics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    WITH user_sessions AS (
        SELECT
            session_id,
            EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 60 AS session_duration_minutes
        FROM public.user_activity_events
        WHERE user_id = p_user_id
        GROUP BY session_id
    )
    SELECT jsonb_build_object(
        'totalSessions', (SELECT COUNT(*) FROM user_sessions),
        'averageSessionDurationMinutes', (SELECT AVG(session_duration_minutes) FROM user_sessions),
        'totalCampaignsCreated', (SELECT COUNT(*) FROM public.campaign_templates WHERE user_id = p_user_id)
    ) INTO result;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION get_user_activity_analytics IS 'Agrega y devuelve KPIs sobre la actividad de un usuario registrado en la plataforma.';

-- Refactorizar la función existente para usar la tabla renombrada
DROP FUNCTION IF EXISTS get_campaign_analytics(p_workspace_id UUID, p_campaign_id TEXT, p_variant_id TEXT);
CREATE OR REPLACE FUNCTION get_campaign_analytics(p_workspace_id UUID, p_campaign_id TEXT, p_variant_id TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    WITH all_visitor_events AS (
        SELECT session_id, event_type, created_at FROM public.visitor_campaign_events
        WHERE workspace_id = p_workspace_id AND campaign_id = p_campaign_id AND variant_id = p_variant_id
        UNION ALL
        SELECT ace.session_id, ace.event_type, ace.created_at
        FROM public.anonymous_campaign_events ace
        WHERE ace.workspace_id = p_workspace_id AND ace.campaign_id = p_campaign_id AND ace.variant_id = p_variant_id
    )
    -- La lógica de agregación de KPIs para visitantes permanece aquí...
    SELECT jsonb_build_object(
        'totalVisitors', (SELECT COUNT(DISTINCT session_id) FROM all_visitor_events)
    ) INTO result;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION get_campaign_analytics IS 'Agrega datos de analíticas de VISITANTES para una variante de campaña específica.';


COMMIT;
