-- RUTA: supabase/migrations/YYYYMMDDHHMMSS_create_artifacts_vault.sql
/**
 * @file YYYYMMDDHHMMSS_create_artifacts_vault.sql
 * @description Migración para crear la tabla `campaign_artifacts` y sus políticas de seguridad.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- FASE 1: Crear la tabla `campaign_artifacts`
CREATE TABLE public.campaign_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    draft_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.campaign_artifacts IS 'Manifiesto de los artefactos .zip generados por el Motor de Forja.';

-- FASE 2: Activar Row Level Security
ALTER TABLE public.campaign_artifacts ENABLE ROW LEVEL SECURITY;

-- FASE 3: Crear la política de acceso
CREATE POLICY "Los miembros del workspace pueden acceder a sus artefactos"
ON public.campaign_artifacts
FOR SELECT
USING (is_workspace_member(workspace_id));

-- FASE 4: Crear índices para optimizar las consultas
CREATE INDEX idx_artifacts_on_workspace_draft ON public.campaign_artifacts (workspace_id, draft_id);
