-- ============================================================================
-- SCRIPT DE NIVELACIÓN DEFINITIVO: TABLA PROFILES Y ECOSISTEMA (v4.2 - Resiliente)
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- SOLUCIÓN: Habilita la extensión 'moddatetime' requerida.
-- ============================================================================

-- 0. HABILITAR LA EXTENSIÓN 'moddatetime'
--    Este paso es CRÍTICO y la causa raíz del error.
--    Crea la función extensions.moddatetime() si no existe.
create extension if not exists moddatetime with schema extensions;

-- 1. Crear la tabla 'profiles'
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    provider_name TEXT,
    provider_avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Almacena metadatos de aplicación para los usuarios, unificando perfiles de múltiples proveedores de identidad.';

-- 2. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas RLS
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Crear Trigger para la creación automática de perfiles
--    Este trigger invoca la función 'handle_new_user' que debe haber sido creada previamente.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Crear Trigger para la actualización automática de 'updated_at'
--    Ahora puede encontrar la función extensions.moddatetime() porque fue habilitada en el paso 0.
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================================
-- FIN DE NIVELACIÓN DE PROFILES
-- ============================================================================

-- ============================================================================
-- SCRIPT DE NIVELACIÓN QUIRÚRGICA: POLÍTICA DE INSERCIÓN DE PROFILES
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- SOLUCIÓN: Corrige la política RLS de INSERT para permitir que los usuarios
--          creen su propio perfil, cerrando una vulnerabilidad crítica.
-- ============================================================================

-- 1. Eliminar la política de INSERT incorrecta si existe.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- 2. Crear la política de INSERT correcta con la cláusula WITH CHECK.
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIN DE NIVELACIÓN QUIRÚRGICA
-- ============================================================================

-- ============================================================================
-- SCRIPT DE NIVELACIÓN QUIRÚRGICA: POLÍTICA DE INSERCIÓN DE PROFILES
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- SOLUCIÓN: Corrige la política RLS de INSERT para permitir que los usuarios
--          creen su propio perfil, cerrando una vulnerabilidad crítica.
-- ============================================================================

-- 1. Eliminar la política de INSERT incorrecta si existe.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- 2. Crear la política de INSERT correcta con la cláusula WITH CHECK.
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIN DE NIVELACIÓN QUIRÚRGICA
-- ============================================================================

-- ============================================================================
-- SCRIPT DE NIVELACIÓN QUIRÚRGICA: POLÍTICA DE INSERCIÓN DE PROFILES
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- SOLUCIÓN: Corrige la política RLS de INSERT para permitir que los usuarios
--          creen su propio perfil, cerrando una vulnerabilidad funcional crítica.
-- ============================================================================

-- 1. Eliminar la política de INSERT incorrecta y vulnerable.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- 2. Crear la política de INSERT correcta y segura con la cláusula WITH CHECK.
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIN DE NIVELACIÓN QUIRÚRGICA
-- ============================================================================

-- ============================================================================
-- SCRIPT DE NIVELACIÓN QUIRÚRGICA: POLÍTICA DE INSERCIÓN DE PROFILES
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- SOLUCIÓN: Corrige la política RLS de INSERT para permitir que los usuarios
--          creen su propio perfil, cerrando una vulnerabilidad funcional crítica.
-- ============================================================================

-- 1. Eliminar la política de INSERT incorrecta y vulnerable.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- 2. Crear la política de INSERT correcta y segura con la cláusula WITH CHECK.
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIN DE NIVELACIÓN QUIRÚRGICA
-- ============================================================================

-- ============================================================================
-- PASO 1: ELIMINACIÓN DE LA POLÍTICA DE INSERT DEFECTUOSA
-- ============================================================================

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- ============================================================================
-- PASO 2: CREACIÓN DE LA POLÍTICA DE INSERT SEGURA Y FUNCIONAL
-- ============================================================================

CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);


