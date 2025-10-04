-- ============================================================================
-- SCRIPT DE NIVELACIÓN FINAL: TABLA USER_PREFERENCES (v1.0)
-- Crea la tabla para persistir las preferencias del usuario (tema, idioma, etc.)
-- ============================================================================

BEGIN;

-- 1. Crear la tabla 'user_preferences'
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT CHECK (theme IN ('light', 'dark', 'system')),
    locale TEXT,
    -- Futuras columnas de preferencias irán aquí
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.user_preferences IS 'Almacena las preferencias de UI de un usuario autenticado.';

-- 2. Habilitar RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas RLS
DROP POLICY IF EXISTS "Los usuarios pueden gestionar sus propias preferencias" ON public.user_preferences;
CREATE POLICY "Los usuarios pueden gestionar sus propias preferencias"
ON public.user_preferences
FOR ALL
USING (auth.uid() = user_id);

-- 4. Crear Trigger para 'updated_at'
DROP TRIGGER IF EXISTS on_user_preferences_update ON public.user_preferences;
CREATE TRIGGER on_user_preferences_update
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime(updated_at);

COMMIT;
-- ============================================================================
-- FIN DE LA NIVELACIÓN ESTRUCTURAL DE LA BASE DE DATOS
-- ============================================================================
