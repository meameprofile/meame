-- ============================================================================
-- SCRIPT DE NIVELACIÓN: ECOSISTEMA DE WORKSPACES (v1.0)
-- Manifiesto de Origen: _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
-- VERIFICACION: pnpm diag:supabase:schema-workspaces
-- ============================================================================

-- 1. Crear la tabla 'workspaces'
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.workspaces IS 'Registro maestro de los workspaces o equipos en el ecosistema.';

-- 2. Crear la tabla pivote 'workspace_members'
CREATE TABLE IF NOT EXISTS public.workspace_members (
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);
COMMENT ON TABLE public.workspace_members IS 'Tabla pivote que define la membresía y el rol de un usuario en un workspace.';

-- 3. Crear la función de seguridad 'is_workspace_member'
--    Esta función será la piedra angular para las políticas RLS en todo el sistema.
CREATE OR REPLACE FUNCTION public.is_workspace_member(
  workspace_id_to_check UUID,
  min_role TEXT DEFAULT 'member'
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = workspace_id_to_check
      AND user_id = auth.uid()
      AND (
        (min_role = 'member' AND (role = 'member' OR role = 'owner')) OR
        (min_role = 'owner' AND role = 'owner')
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear la función trigger 'handle_new_profile_workspace'
--    Esta función crea automáticamente un workspace inicial para cada nuevo perfil.
CREATE OR REPLACE FUNCTION public.handle_new_profile_workspace()
RETURNS TRIGGER AS $$
DECLARE
    new_workspace_id UUID;
BEGIN
  -- Crear un nuevo workspace para el usuario
  INSERT INTO public.workspaces (owner_id, name)
  VALUES (NEW.id, 'Workspace Primario')
  RETURNING id INTO new_workspace_id;

  -- Añadir al usuario como 'owner' en la tabla de miembros
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear el trigger en la tabla 'profiles'
--    Se dispara después de que un nuevo perfil es insertado.
DROP TRIGGER IF EXISTS on_new_profile_create_workspace ON public.profiles;
CREATE TRIGGER on_new_profile_create_workspace
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_workspace();

-- ============================================================================
-- FIN DE NIVELACIÓN DE WORKSPACES
-- ============================================================================
