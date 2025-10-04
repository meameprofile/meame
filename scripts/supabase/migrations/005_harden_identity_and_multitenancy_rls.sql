-- ============================================================================
-- SCRIPT DE BLINDAJE SOBERANO: IDENTIDAD Y MULTI-TENANCY (v1.0)
-- Este script es autocontenido y garantiza la creación de todas las
-- funciones y políticas de seguridad necesarias para los dominios
-- 'profiles' y 'workspaces'.
-- ============================================================================

BEGIN;

-- 1. ASEGURAR EXTENSIÓN NECESARIA
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

-- 2. CREAR FUNCIONES HELPER DE SEGURIDAD (IDEMPOTENTE)
CREATE OR REPLACE FUNCTION public.get_user_role_in_workspace(
  workspace_id_to_check UUID
) RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.workspace_members
  WHERE workspace_id = workspace_id_to_check AND user_id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.get_user_role_in_workspace IS 'Devuelve el rol de un usuario dentro de un workspace específico.';

-- 3. HABILITAR Y BLINDAR LA TABLA 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3.1. Corregir política de INSERT para 'profiles'
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3.2. Asegurar políticas de SELECT y UPDATE para 'profiles'
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. HABILITAR Y BLINDAR LA TABLA 'workspaces'
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar sus workspaces" ON public.workspaces;
CREATE POLICY "Los miembros del workspace pueden gestionar sus workspaces"
ON public.workspaces FOR ALL USING (public.is_workspace_member(id));

-- 5. HABILITAR Y BLINDAR LA TABLA 'workspace_members'
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Los miembros pueden ver a otros miembros de su workspace" ON public.workspace_members;
CREATE POLICY "Los miembros pueden ver a otros miembros de su workspace"
ON public.workspace_members FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "Los propietarios pueden gestionar los miembros del workspace" ON public.workspace_members;
CREATE POLICY "Los propietarios pueden gestionar los miembros del workspace"
ON public.workspace_members FOR ALL USING ( (public.get_user_role_in_workspace(workspace_id) = 'owner') );

COMMIT;
-- ============================================================================
-- FIN DEL BLINDAJE SOBERANO
-- ============================================================================
