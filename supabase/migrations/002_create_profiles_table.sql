-- RUTA: supabase/migrations/002_create_profiles_table.sql
/**
 * @file 002_create_profiles_table.sql
 * @description Migración para crear la tabla 'profiles' que extiende auth.users.
 *              Esta tabla es la SSoT para los metadatos de usuario de la aplicación.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- 1. Crear la tabla de perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Almacena datos de perfil público para cada usuario.';

-- 2. Habilitar Row Level Security (RLS)
-- ¡Paso de seguridad crítico!
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas RLS
-- Los usuarios pueden ver su propio perfil.
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Los usuarios pueden insertar su propio perfil.
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar su propio perfil.
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Función Trigger para mantener actualizado 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para la función
CREATE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_profile_update();
