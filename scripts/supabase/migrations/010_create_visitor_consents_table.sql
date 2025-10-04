-- ============================================================================
-- SCRIPT DE NIVELACIÓN: TABLA VISITOR_CONSENTS (v1.0)
-- Crea la tabla para registrar el consentimiento de cookies de forma auditable.
-- VERIFICACION: pnpm diag:supabase:schema-all
-- ============================================================================

BEGIN;

-- 1. Crear tipo ENUM para el estado del consentimiento.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consent_status_type') THEN
        CREATE TYPE public.consent_status_type AS ENUM ('accepted', 'rejected');
    END IF;
END$$;

-- 2. Crear la tabla 'visitor_consents'
CREATE TABLE IF NOT EXISTS public.visitor_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint_id TEXT NOT NULL UNIQUE,
    session_id TEXT NOT NULL,
    ip_address_encrypted TEXT,
    user_agent_encrypted TEXT,
    consent_status public.consent_status_type NOT NULL,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.visitor_consents IS 'Registro auditable del consentimiento de cookies de los visitantes.';

-- 3. Habilitar RLS y restringir al rol de servicio
ALTER TABLE public.visitor_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir acceso solo al rol de servicio" ON public.visitor_consents;
CREATE POLICY "Permitir acceso solo al rol de servicio"
ON public.visitor_consents
FOR ALL
USING (auth.role() = 'service_role');

-- 4. Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_visitor_consents_fingerprint_id ON public.visitor_consents(fingerprint_id);

COMMIT;
-- ============================================================================
-- FIN DE NIVELACIÓN DE VISITOR_CONSENTS
-- ============================================================================
