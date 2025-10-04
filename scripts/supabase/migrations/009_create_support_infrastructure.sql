-- ============================================================================
-- SCRIPT DE NIVELACIÓN HOLÍSTICO: INFRAESTRUCTURA DE SOPORTE (v1.0)
-- Crea las tablas y funciones para Notificaciones, Inteligencia de Visitantes
-- (Aura), e Invitaciones en una única transacción atómica.
-- VERIFICAR: pnpm diag:supabase:schema-all
-- ============================================================================

BEGIN;

-- =================================================================
-- DOMINIO 1: SISTEMA DE NOTIFICACIONES
-- Manifiesto: supabase/002_create_notifications_system.sql
-- =================================================================

-- 1.1. Crear un tipo ENUM para los tipos de notificación.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');
    END IF;
END$$;

-- 1.2. Crear la tabla de notificaciones.
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  type public.notification_type NOT NULL,
  message TEXT NOT NULL,
  link TEXT NULL
);
COMMENT ON TABLE public.notifications IS 'Almacena notificaciones para los usuarios dentro de la aplicación.';

-- 1.3. Activar RLS y aplicar política de seguridad.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Los usuarios pueden gestionar sus propias notificaciones" ON public.notifications;
CREATE POLICY "Los usuarios pueden gestionar sus propias notificaciones" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- =================================================================
-- DOMINIO 2: INTELIGENCIA DE VISITANTES (AURA)
-- Manifiesto: _docs/databases-schemas/000_MANIFIESTO_VISITOR_INTELLIGENCE.md
-- =================================================================

-- 2.1. Crear la tabla 'visitor_sessions' (SSoT de Sesiones).
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    session_id TEXT PRIMARY KEY, -- CUID2 generado por la aplicación
    fingerprint_id TEXT UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    ip_address_encrypted TEXT,
    user_agent_encrypted TEXT,
    geo_encrypted JSONB,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.visitor_sessions IS 'Almacena cada sesión de visitante, comenzando como anónima y potencialmente vinculada a un usuario.';

-- 2.2. Crear la tabla 'visitor_campaign_events' (Telemetría Granular).
CREATE TABLE IF NOT EXISTS public.visitor_campaign_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES public.visitor_sessions(session_id) ON DELETE CASCADE,
    campaign_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- ej. 'pageview', 'click', 'rrweb_event'
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.visitor_campaign_events IS 'Registro granular de cada evento de telemetría que ocurre durante una sesión.';

-- 2.3. Habilitar RLS y restringir acceso al rol de servicio.
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_campaign_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir acceso solo al rol de servicio" ON public.visitor_sessions;
CREATE POLICY "Permitir acceso solo al rol de servicio" ON public.visitor_sessions FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Permitir acceso solo al rol de servicio" ON public.visitor_campaign_events;
CREATE POLICY "Permitir acceso solo al rol de servicio" ON public.visitor_campaign_events FOR ALL USING (auth.role() = 'service_role');

-- 2.4. Crear la función de vinculación "Traspaso".
CREATE OR REPLACE FUNCTION public.link_fingerprint_to_user(p_fingerprint_id TEXT, p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.visitor_sessions
    SET user_id = p_user_id, last_seen_at = now()
    WHERE fingerprint_id = p_fingerprint_id AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.link_fingerprint_to_user IS 'Vincula una sesión de visitante anónimo a un usuario autenticado.';

-- =================================================================
-- DOMINIO 3: SISTEMA DE INVITACIONES
-- =================================================================

-- 3.1. Crear tipo ENUM para el estado de la invitación.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
        CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'declined');
    END IF;
END$$;

-- 3.2. Crear la tabla 'invitations'.
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    invited_by_user_id UUID NOT NULL REFERENCES auth.users(id),
    invitee_email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status public.invitation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.invitations IS 'Almacena invitaciones para que nuevos usuarios se unan a un workspace.';

-- 3.3. Habilitar RLS y aplicar políticas.
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los miembros pueden ver las invitaciones de su workspace" ON public.invitations;
CREATE POLICY "Los miembros pueden ver las invitaciones de su workspace" ON public.invitations FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "Los propietarios pueden gestionar las invitaciones" ON public.invitations;
CREATE POLICY "Los propietarios pueden gestionar las invitaciones" ON public.invitations FOR ALL USING ((public.get_user_role_in_workspace(workspace_id) = 'owner'));

COMMIT;
-- ============================================================================
-- FIN DE NIVELACIÓN DE INFRAESTRUCTURA DE SOPORTE
-- ============================================================================
