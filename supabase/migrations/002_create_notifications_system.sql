-- ARCHIVO: supabase/migrations/002_create_notifications_system.sql
/**
 * Migración 002: Crea la tabla de notificaciones y sus políticas de seguridad.
 */

-- 1. Crear un tipo ENUM para los tipos de notificación.
-- Esto asegura la consistencia de los datos.
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- 2. Crear la tabla de notificaciones.
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  type public.notification_type NOT NULL,
  message TEXT NOT NULL,
  link TEXT NULL -- Opcional, para notificaciones accionables (ej. "Ver campaña")
);
COMMENT ON TABLE public.notifications IS 'Almacena notificaciones para los usuarios dentro de la aplicación.';

-- 3. Activar RLS para la máxima seguridad.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Crear la política de acceso.
-- Permite a los usuarios leer y modificar (marcar como leída) SÓLO sus propias notificaciones.
CREATE POLICY "Los usuarios pueden gestionar sus propias notificaciones"
ON public.notifications
FOR ALL
USING (auth.uid() = user_id);
