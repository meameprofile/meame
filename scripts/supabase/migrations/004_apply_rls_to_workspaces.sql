-- ============================================================================
-- SCRIPT DE NIVELACIÓN: POLÍTICAS RLS PARA WORKSPACES (v1.0)
-- Manifiesto de Origen: Implícito en la arquitectura multi-tenant
-- SOLUCIÓN: Habilita y aplica RLS a las tablas 'workspaces' y 'workspace_members'
--          para garantizar el aislamiento de datos entre tenants.
-- VERIFICAR: pnpm diag:supabase:schema-rls
-- ============================================================================

-- 1. Habilitar RLS en la tabla 'workspaces'
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- 2. Política para 'workspaces': Los miembros pueden ver/interactuar con sus propios workspaces.
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar sus workspaces" ON public.workspaces;
CREATE POLICY "Los miembros del workspace pueden gestionar sus workspaces"
ON public.workspaces
FOR ALL
USING (public.is_workspace_member(id)); -- La función 'is_workspace_member' comprueba si el usuario actual es miembro del workspace cuya fila se está evaluando.

-- 3. Habilitar RLS en la tabla 'workspace_members'
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- 4. Política para 'workspace_members': Los miembros pueden ver a otros miembros del mismo workspace.
DROP POLICY IF EXISTS "Los miembros pueden ver a otros miembros de su workspace" ON public.workspace_members;
CREATE POLICY "Los miembros pueden ver a otros miembros de su workspace"
ON public.workspace_members
FOR SELECT
USING (public.is_workspace_member(workspace_id));

-- 5. Política para 'workspace_members': Solo los propietarios ('owner') pueden añadir, modificar o eliminar miembros.
DROP POLICY IF EXISTS "Los propietarios pueden gestionar los miembros del workspace" ON public.workspace_members;
CREATE POLICY "Los propietarios pueden gestionar los miembros del workspace"
ON public.workspace_members
FOR ALL -- Aplica a INSERT, UPDATE, DELETE
USING ( (get_user_role_in_workspace(workspace_id) = 'owner') ); -- Asumiendo que 'get_user_role_in_workspace' existe

-- ============================================================================
-- FIN DE NIVELACIÓN DE RLS PARA WORKSPACES
-- ============================================================================

-- ============================================================================
-- SCRIPT DE NIVELACIÓN HOLÍSTICO: SEGURIDAD DE WORKSPACES (v1.1)
-- SOLUCIÓN: Crea la función 'get_user_role_in_workspace' FALTANTE y luego
--          aplica las políticas RLS que dependen de ella.
-- ============================================================================

-- 1. CREAR LA FUNCIÓN HELPER DE ROL DE USUARIO
--    Esta función es esencial para políticas de seguridad basadas en roles.
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

-- 2. HABILITAR RLS EN LA TABLA 'workspaces'
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA PARA 'workspaces': Los miembros pueden ver/interactuar con sus propios workspaces.
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar sus workspaces" ON public.workspaces;
CREATE POLICY "Los miembros del workspace pueden gestionar sus workspaces"
ON public.workspaces
FOR ALL
USING (public.is_workspace_member(id));

-- 4. HABILITAR RLS EN LA TABLA 'workspace_members'
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICA PARA 'workspace_members': Los miembros pueden ver a otros miembros del mismo workspace.
DROP POLICY IF EXISTS "Los miembros pueden ver a otros miembros de su workspace" ON public.workspace_members;
CREATE POLICY "Los miembros pueden ver a otros miembros de su workspace"
ON public.workspace_members
FOR SELECT
USING (public.is_workspace_member(workspace_id));

-- 6. POLÍTICA PARA 'workspace_members': Solo los propietarios ('owner') pueden añadir, modificar o eliminar miembros.
--    Esta política ahora funcionará porque la función 'get_user_role_in_workspace' ya existe.
DROP POLICY IF EXISTS "Los propietarios pueden gestionar los miembros del workspace" ON public.workspace_members;
CREATE POLICY "Los propietarios pueden gestionar los miembros del workspace"
ON public.workspace_members
FOR ALL -- Aplica a INSERT, UPDATE, DELETE
USING ( (public.get_user_role_in_workspace(workspace_id) = 'owner') );

-- ============================================================================
-- FIN DE NIVELACIÓN DE RLS PARA WORKSPACES
-- ============================================================================


