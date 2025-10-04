/**
 * @file YYYYMMDDHHMMSS_create_theme_presets_table.sql
 * @description Migración para crear la tabla soberana 'theme_presets' para
 *              almacenar temas de campaña personalizados y reutilizables.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- FASE 1: Limpieza de la tabla de fragmentos obsoleta (si existe)
DROP TRIGGER IF EXISTS handle_theme_fragments_update ON public.theme_fragments;
DROP TABLE IF EXISTS public.theme_fragments;

-- FASE 2: Crear la nueva tabla `theme_presets`
CREATE TABLE public.theme_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    theme_config JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_workspace_preset_name UNIQUE (workspace_id, name)
);

COMMENT ON TABLE public.theme_presets IS 'Almacena presets de temas completos, guardados por usuarios para un workspace específico.';

-- FASE 3: Activar RLS
ALTER TABLE public.theme_presets ENABLE ROW LEVEL SECURITY;

-- FASE 4: Crear Política de Seguridad Soberana
-- Esta única política gobierna todas las interacciones con la tabla.
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar sus presets de tema" ON public.theme_presets;
CREATE POLICY "Los miembros del workspace pueden gestionar sus presets de tema"
    ON public.theme_presets
    FOR ALL
    USING (public.is_workspace_member(workspace_id));

-- FASE 5: Crear Índices para Rendimiento
CREATE INDEX IF NOT EXISTS idx_theme_presets_workspace_id ON public.theme_presets(workspace_id);

-- FASE 6: Crear Trigger para `updated_at`
DROP TRIGGER IF EXISTS handle_theme_presets_update ON public.theme_presets;
CREATE TRIGGER handle_theme_presets_update
    BEFORE UPDATE ON public.theme_presets
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);
