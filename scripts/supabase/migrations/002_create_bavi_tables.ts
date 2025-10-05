// scripts/supabase/migrations/002_create_bavi_tables.ts
// EJECUTE: pnpm tsx scripts/supabase/migrations/002_create_bavi_tables.ts

/**
 * @file 002_create_bavi_tables.ts
 * @description Script generador de SQL para la creación soberana de las tablas del dominio BAVI.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { scriptLogger } from "../../_utils/logger";

function generateBaviCreationSql() {
  const traceId = scriptLogger.startTrace("generateBaviCreationSql");
  scriptLogger.startGroup("Generando SQL de creación para el dominio BAVI...");

  const creationQueries = `
-- ============================================================================
-- SCRIPT DE CREACIÓN SOBERANA PARA EL DOMINIO BAVI (v2.0)
-- Generado: ${new Date().toISOString()}
-- Ejecute este script para crear las tablas 'bavi_assets' y 'bavi_variants'
-- y todas sus reglas asociadas desde cero.
-- ============================================================================

-- 1. CREACIÓN DE LA TABLA 'bavi_assets'
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

-- 2. CREACIÓN DE LA TABLA 'bavi_variants'
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

-- 3. HABILITACIÓN DE SEGURIDAD A NIVEL DE FILA (RLS)
ALTER TABLE public.bavi_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bavi_variants ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE SEGURIDAD (RLS)
-- bavi_assets
DROP POLICY IF EXISTS "Permitir acceso de lectura pública a los activos" ON public.bavi_assets;
CREATE POLICY "Permitir acceso de lectura pública a los activos"
ON public.bavi_assets FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar activos" ON public.bavi_assets;
CREATE POLICY "Los miembros del workspace pueden gestionar activos"
ON public.bavi_assets FOR ALL
USING (public.is_workspace_member(workspace_id));

-- bavi_variants
DROP POLICY IF EXISTS "Permitir acceso de lectura pública a las variantes" ON public.bavi_variants;
CREATE POLICY "Permitir acceso de lectura pública a las variantes"
ON public.bavi_variants FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar variantes" ON public.bavi_variants;
CREATE POLICY "Los miembros del workspace pueden gestionar variantes"
ON public.bavi_variants FOR ALL
USING (public.is_workspace_member((SELECT ba.workspace_id FROM public.bavi_assets ba WHERE ba.asset_id = bavi_variants.asset_id)));

-- 5. TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA DE 'updated_at' EN 'bavi_assets'
CREATE OR REPLACE TRIGGER on_bavi_asset_update
BEFORE UPDATE ON public.bavi_assets
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================================================
-- FIN DEL SCRIPT DE CREACIÓN
-- ============================================================================
  `;

  console.log(
    "\n\n-- SCRIPT SQL PARA CREACIÓN DEL DOMINIO BAVI DESDE CERO --\n"
  );
  console.log(creationQueries);
  console.log("\n-- FIN DEL SCRIPT SQL --\n\n");

  scriptLogger.success(
    "El script SQL de creación para BAVI ha sido generado en la consola."
  );
  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
}

generateBaviCreationSql();
