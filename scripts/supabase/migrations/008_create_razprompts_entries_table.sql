-- ============================================================================
-- SCRIPT DE NIVELACIÓN: TABLA RAZPROMPTS_ENTRIES (v2.0)
-- Manifiesto de Origen: _docs/supabase/004_MANIFIESTO_TABLA_RAZPROMPTS_ENTRIES.md
--  VERIFICACION: pnpm diag:supabase:schema-razprompts
-- ============================================================================

BEGIN;

-- 1. Crear la tabla 'razprompts_entries'
CREATE TABLE IF NOT EXISTS public.razprompts_entries (
    id TEXT PRIMARY KEY CHECK (id ~ '^c[a-z0-9]{24}$'),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_generation' CHECK (status IN ('pending_generation', 'generated', 'archived')),
    ai_service TEXT NOT NULL,
    keywords TEXT[],
    versions JSONB NOT NULL,
    tags JSONB,
    bavi_asset_ids TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.razprompts_entries IS 'Almacena el genoma creativo (prompts, parámetros) de los activos visuales.';

-- 2. Habilitar RLS
ALTER TABLE public.razprompts_entries ENABLE ROW LEVEL SECURITY;

-- 3. Crear Política de Seguridad Soberana
--    Esta única política gobierna todas las interacciones, garantizando
--    que solo los miembros del workspace puedan gestionar sus propios prompts.
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar sus prompts" ON public.razprompts_entries;
CREATE POLICY "Los miembros del workspace pueden gestionar sus prompts"
ON public.razprompts_entries
FOR ALL
USING (public.is_workspace_member(workspace_id))
WITH CHECK (public.is_workspace_member(workspace_id));

-- 4. Crear Trigger para 'updated_at'
DROP TRIGGER IF EXISTS on_razprompt_update ON public.razprompts_entries;
CREATE TRIGGER on_razprompt_update
    BEFORE UPDATE ON public.razprompts_entries
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime(updated_at);

COMMIT;
-- ============================================================================
-- FIN DE NIVELACIÓN DE RAZPROMPTS
-- ============================================================================
