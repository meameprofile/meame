-- RUTA: supabase/migrations/0008_upgrade_aura_to_v4.1_fix.sql
/**
 * @file 0008_upgrade_aura_to_v4.1_fix.sql
 * @description Corrige el error tipográfico en el tipo de dato TIMESTAMPTZ.
 *              Esta versión es la SSoT para la infraestructura de "Aura".
 * @version 1.0.1
 * @author RaZ Podestá - MetaShark Tech
 */

BEGIN;

-- =================================================================
-- FASE 1: CREACIÓN DE TABLAS PARA TRACKING ANÓNIMO (CORREGIDO)
-- =================================================================

CREATE TABLE IF NOT EXISTS public.anonymous_campaign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- CORREGIDO
    fingerprint_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    campaign_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB
);
COMMENT ON TABLE public.anonymous_campaign_events IS 'Almacena eventos de visitantes anónimos, identificados por huella digital.';

CREATE TABLE IF NOT EXISTS public.visitor_fingerprints (
    fingerprint_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    linked_at TIMESTAMPTZ NOT NULL DEFAULT now() -- CORREGIDO
);
COMMENT ON TABLE public.visitor_fingerprints IS 'Vincula una huella digital anónima a un user_id después del registro/login.';

CREATE INDEX IF NOT EXISTS idx_anon_events_fingerprint_id ON public.anonymous_campaign_events(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_anon_events_workspace_campaign ON public.anonymous_campaign_events(workspace_id, campaign_id, variant_id);


-- =================================================================
-- FASE 2: REFACTORIZACIÓN DE LA FUNCIÓN DE AGREGACIÓN
-- =================================================================

DROP FUNCTION IF EXISTS get_campaign_analytics(p_workspace_id UUID);

CREATE OR REPLACE FUNCTION get_campaign_analytics(p_workspace_id UUID, p_campaign_id TEXT, p_variant_id TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    WITH all_events AS (
        SELECT session_id, user_id, event_type, created_at FROM public.campaign_events
        WHERE workspace_id = p_workspace_id AND campaign_id = p_campaign_id AND variant_id = p_variant_id
        UNION ALL
        SELECT ace.session_id, vf.user_id, ace.event_type, ace.created_at
        FROM public.anonymous_campaign_events ace
        JOIN public.visitor_fingerprints vf ON ace.fingerprint_id = vf.fingerprint_id
        WHERE ace.workspace_id = p_workspace_id AND ace.campaign_id = p_campaign_id AND ace.variant_id = p_variant_id
    ),
    kpis AS (
        SELECT
            COUNT(DISTINCT session_id) AS total_visitors,
            (COUNT(DISTINCT CASE WHEN event_type = 'conversion' THEN session_id END)) AS total_conversions,
            EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / NULLIF(COUNT(DISTINCT session_id), 0) AS average_time_on_page
        FROM all_events
    )
    SELECT jsonb_build_object(
        'summary', (SELECT row_to_json(k) FROM kpis k)
    ) INTO result;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_campaign_analytics IS 'Agrega datos de analíticas para una variante de campaña específica.';

COMMIT;
