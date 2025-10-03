// scripts/supabase/migrations/001_create_profiles_table.ts
// EJECUTE: pnpm tsx scripts/supabase/migrations/001_create_profiles_table.ts
// VERIFICACION : pnpm diag:supabase:schema-profiles
/**
 * @file 001_create_profiles_table.ts
 * @description Script generador de SQL para la creación soberana de la tabla 'profiles' desde cero.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { scriptLogger } from "../../_utils/logger";

function generateCreationSql() {
  const traceId = scriptLogger.startTrace("generateCreationSqlForProfiles");
  scriptLogger.startGroup("Generando SQL de creación para `profiles`...");

  const creationQueries = `
-- ============================================================================
-- SCRIPT DE CREACIÓN SOBERANA PARA LA TABLA 'profiles' (v4.0)
-- Generado: ${new Date().toISOString()}
-- Ejecute este script para crear la tabla y todas sus reglas asociadas.
-- ============================================================================

-- 1. CREACIÓN DE LA TABLA 'profiles'
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

-- 2. HABILITACIÓN DE SEGURIDAD A NIVEL DE FILA (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURIDAD (RLS)
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 4. FUNCIÓN PARA CREACIÓN AUTOMÁTICA DE PERFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA DE 'updated_at'
CREATE OR REPLACE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================================================
-- FIN DEL SCRIPT DE CREACIÓN
-- ============================================================================
  `;

  console.log(
    "\n\n-- SCRIPT SQL PARA CREACIÓN DE TABLA 'profiles' DESDE CERO --\n"
  );
  console.log(creationQueries);
  console.log("\n-- FIN DEL SCRIPT SQL --\n\n");

  scriptLogger.success(
    "El script SQL de creación ha sido generado en la consola."
  );
  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
}

generateCreationSql();
