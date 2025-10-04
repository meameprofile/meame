-- ============================================================================
-- SCRIPT DE NIVELACIÓN: ECOSISTEMA BAVI (v2.0)
-- Manifiesto de Origen: _docs/supabase/002_MANIFIESTO_TABLAS_BAVI.md
-- VERIFICAR: pnpm diag:supabase:schema-bavi-variants
-- ============================================================================

BEGIN;

-- 1. Crear la tabla 'bavi_assets' (El Contenedor Conceptual)
CREATE TABLE IF NOT EXISTS public.bavi_assets (
    asset_id TEXT PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'pending')),
    provider TEXT NOT NULL DEFAULT 'cloudinary',
    description TEXT,
    prompt_id TEXT,
    tags JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.bavi_assets IS 'Registro maestro de activos visuales en el ecosistema.';
COMMENT ON COLUMN public.bavi_assets.asset_id IS 'ID único basado en la nomenclatura SNIA.';

-- 2. Crear la tabla 'bavi_variants' (La Manifestación Física)
CREATE TABLE IF NOT EXISTS public.bavi_variants (
    variant_id TEXT NOT NULL,
    asset_id TEXT NOT NULL REFERENCES public.bavi_assets(asset_id) ON DELETE CASCADE,
    public_id TEXT NOT NULL,
    state TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (asset_id, variant_id)
);
COMMENT ON TABLE public.bavi_variants IS 'Almacena las diferentes versiones y formatos de un activo BAVI.';
COMMENT ON COLUMN public.bavi_variants.asset_id IS 'Garantiza que cada variante pertenezca a un activo existente.';

-- 3. Habilitar RLS en ambas tablas
ALTER TABLE public.bavi_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bavi_variants ENABLE ROW LEVEL SECURITY;

-- 4. Aplicar Políticas de Seguridad a 'bavi_assets'
DROP POLICY IF EXISTS "Permitir acceso de lectura pública a los activos" ON public.bavi_assets;
CREATE POLICY "Permitir acceso de lectura pública a los activos" ON public.bavi_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar activos" ON public.bavi_assets;
CREATE POLICY "Los miembros del workspace pueden gestionar activos" ON public.bavi_assets FOR ALL USING (public.is_workspace_member(workspace_id));

-- 5. Aplicar Políticas de Seguridad a 'bavi_variants'
DROP POLICY IF EXISTS "Permitir acceso de lectura pública a las variantes" ON public.bavi_variants;
CREATE POLICY "Permitir acceso de lectura pública a las variantes" ON public.bavi_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar variantes" ON public.bavi_variants;
CREATE POLICY "Los miembros del workspace pueden gestionar variantes" ON public.bavi_variants FOR ALL USING (public.is_workspace_member((
    SELECT workspace_id FROM public.bavi_assets WHERE asset_id = bavi_variants.asset_id
)));

COMMIT;
-- ============================================================================
-- FIN DE NIVELACIÓN DE BAVI
-- ============================================================================
