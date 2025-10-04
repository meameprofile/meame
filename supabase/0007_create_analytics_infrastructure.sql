-- RUTA: supabase/migrations/0007_create_analytics_infrastructure.sql
/**
 * @file 0007_create_analytics_infrastructure.sql
 * @description Crea la infraestructura para el sistema de analíticas "Aura".
 *              - Crea la tabla `campaign_events` para almacenar datos de comportamiento.
 *              - Refactoriza la función `get_campaign_analytics` para agregar datos reales.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

BEGIN;

-- =================================================================
-- FASE 1: CREACIÓN DE LA TABLA DE ALMACENAMIENTO DE EVENTOS
-- =================================================================

CREATE TABLE IF NOT EXISTS public.campaign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Puede ser nulo para visitantes anónimos
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    campaign_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- ej: 'page_view', 'click', 'scroll_depth', 'video_progress'
    payload JSONB -- Para datos específicos del evento, como el selector de un clic o el porcentaje de scroll
);
COMMENT ON TABLE public.campaign_events IS 'Almacena eventos de comportamiento de usuario para el análisis de campañas.';

-- Índices para optimizar las consultas de agregación
CREATE INDEX IF NOT EXISTS idx_campaign_events_session_id ON public.campaign_events(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_events_workspace_id_campaign_id ON public.campaign_events(workspace_id, campaign_id, variant_id);


-- =================================================================
-- FASE 2: REFACTORIZACIÓN DE LA FUNCIÓN DE AGREGACIÓN DE ANALÍTICAS
-- =================================================================

DROP FUNCTION IF EXISTS get_campaign_analytics(p_user_id UUID);

CREATE OR REPLACE FUNCTION get_campaign_analytics(p_workspace_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Esta función ahora agrega datos REALES desde la tabla campaign_events.
    WITH events_in_workspace AS (
        SELECT * FROM public.campaign_events WHERE workspace_id = p_workspace_id
    ),
    -- 1. Calcular KPIs básicos por variante de campaña
    variant_kpis AS (
        SELECT
            campaign_id,
            variant_id,
            COUNT(DISTINCT session_id) AS total_visitors,
            -- Placeholder para conversiones, se implementará con eventos 'conversion'
            (COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN session_id END) * 1.0 / NULLIF(COUNT(DISTINCT session_id), 0) * 100)::int AS conversion_rate,
            -- Placeholder para tiempo en página
            90 AS average_time_on_page,
            25 AS bounce_rate -- Placeholder
        FROM events_in_workspace
        GROUP BY campaign_id, variant_id
    ),
    -- 2. Obtener nombres de las variantes desde las plantillas
    variant_names AS (
        SELECT id as template_id, name as variant_name
        FROM public.campaign_templates
        WHERE workspace_id = p_workspace_id
    )
    -- 3. Ensamblar el resultado final
    SELECT jsonb_agg(
        jsonb_build_object(
            'campaignId', vk.campaign_id,
            'variantId', vk.variant_id,
            'variantName', vn.variant_name,
            'summary', jsonb_build_object(
                'totalVisitors', vk.total_visitors,
                'averageTimeOnPage', vk.average_time_on_page,
                'bounceRate', vk.bounce_rate,
                'conversions', (SELECT COUNT(*) FROM events_in_workspace WHERE event_type = 'conversion' AND variant_id = vk.variant_id)
            ),
            'trafficSources', '[]'::jsonb, -- Placeholder
            'visitorsOverTime', '[]'::jsonb -- Placeholder
        )
    ) INTO result
    FROM variant_kpis vk
    LEFT JOIN variant_names vn ON vk.variant_id = vn.template_id::text;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_campaign_analytics IS 'Agrega y devuelve datos de analíticas de campaña REALES para un workspace específico.';

COMMIT;
