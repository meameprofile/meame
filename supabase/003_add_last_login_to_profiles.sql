-- RUTA: supabase/migrations/003_add_last_login_to_profiles.sql
/**
 * @file 003_add_last_login_to_profiles.sql
 * @description Migración para extender la tabla 'profiles' con campos para
 *              registrar la información de la última sesión del usuario.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- 1. Añadir nuevas columnas a la tabla de perfiles
ALTER TABLE public.profiles
ADD COLUMN last_sign_in_at TIMESTAMPTZ,
ADD COLUMN last_sign_in_ip TEXT,
ADD COLUMN last_sign_in_location TEXT;

COMMENT ON COLUMN public.profiles.last_sign_in_at IS 'Timestamp del último inicio de sesión exitoso.';
COMMENT ON COLUMN public.profiles.last_sign_in_ip IS 'Dirección IP del último inicio de sesión.';
COMMENT ON COLUMN public.profiles.last_sign_in_location IS 'Localidad geográfica (ej. "Ciudad, País") del último inicio de sesión.';

-- 2. Crear una función para actualizar la tabla de perfiles al iniciar sesión
-- Esta función se llamará desde una Server Action después de un login exitoso.
CREATE OR REPLACE FUNCTION public.update_user_last_sign_in(
  user_id_input UUID,
  ip_address_input TEXT,
  location_input TEXT
)
RETURNS void AS $$
BEGIN
  -- Actualiza el perfil correspondiente con los nuevos datos de sesión
  UPDATE public.profiles
  SET
    last_sign_in_at = now(),
    last_sign_in_ip = ip_address_input,
    last_sign_in_location = location_input
  WHERE
    user_id = user_id_input;

  -- Actualiza también la tabla de usuarios de Supabase Auth
  UPDATE auth.users
  SET
    last_sign_in_at = now()
  WHERE
    id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear una función trigger para sincronizar desde auth.users a profiles
-- Esto asegura que si Supabase actualiza last_sign_in_at, nuestro perfil también lo refleje.
CREATE OR REPLACE FUNCTION public.sync_last_sign_in()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = NEW.last_sign_in_at
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear el trigger en la tabla auth.users
CREATE TRIGGER on_auth_user_signed_in
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.sync_last_sign_in();
