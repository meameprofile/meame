-- RUTA: supabase/migrations/20250927002500_add_campaign_drafts_table.sql
/**
 * @file 20250927002500_add_campaign_drafts_table.sql
 * @description Migración de élite para la tabla de borradores de campaña.
 *              v2.0.0: Ahora incluye la definición de la función helper
 *              'is_workspace_member' para garantizar la integridad de la dependencia.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- 1. DEFINICIÓN DE LA FUNCIÓN HELPER 'is_workspace_member'
--    Se usa CREATE OR REPLACE para que la operación sea idempotente.
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

-- 2. CREACIÓN DE LA TABLA 'campaign_drafts'
CREATE TABLE IF NOT EXISTS public.campaign_drafts (
    draft_id TEXT PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    draft_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. HABILITAR LA SEGURIDAD A NIVEL DE FILA (RLS)
ALTER TABLE public.campaign_drafts ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICA DE ACCESO
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar borradores" ON public.campaign_drafts;

CREATE POLICY "Los miembros del workspace pueden gestionar borradores"
ON public.campaign_drafts
FOR ALL
USING (is_workspace_member(workspace_id, 'member'::text));

-- 5. TRIGGER DE ACTUALIZACIÓN AUTOMÁTICA
DROP TRIGGER IF EXISTS handle_campaign_draft_update ON public.campaign_drafts;
CREATE TRIGGER handle_campaign_draft_update
BEFORE UPDATE ON public.campaign_drafts
FOR EACH ROW
EXECUTE FUNCTION extensions.moddatetime (updated_at);

-- 6. COMENTARIOS PARA LA DOCUMENTACIÓN DE LA BASE DE DATOS
COMMENT ON TABLE public.campaign_drafts IS 'Almacena los borradores en progreso de la Suite de Diseño de Campañas (SDC). v2.0.0';
COMMENT ON COLUMN public.campaign_drafts.draft_id IS 'ID único del borrador, generado en el cliente.';
COMMENT ON COLUMN public.campaign_drafts.user_id IS 'ID del usuario creador (para auditoría).';
COMMENT ON COLUMN public.campaign_drafts.workspace_id IS 'ID del workspace al que pertenece el borrador.';
COMMENT ON COLUMN public.campaign_drafts.draft_data IS 'Objeto JSONB que contiene el estado completo del borrador de la campaña.';
