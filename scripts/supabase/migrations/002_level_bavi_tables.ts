// scripts/supabase/migrations/002_level_bavi_tables.ts
// EJECUTE: pnpm tsx scripts/supabase/migrations/002_level_bavi_tables.ts
// VERIFICACION: pnpm diag:supabase:schema-bavi-assets && pnpm diag:supabase:schema-bavi-variants

/**
 * @file 002_level_bavi_tables.ts
 * @description Script generador de SQL para alinear las tablas del dominio BAVI
 *              con su manifiesto soberano v2.0.
 * @version 1.0.0 (SQL Generator)
 * @author L.I.A. Legacy
 */
import { scriptLogger } from "../../_utils/logger";

function generateBaviLevelingSql() {
  const traceId = scriptLogger.startTrace("generateBaviLevelingSql");
  scriptLogger.startGroup("Generando SQL de nivelación para tablas BAVI...");

  const migrationQueries = `
-- ============================================================================
-- MIGRACIÓN QUIRÚRGICA PARA LAS TABLAS 'bavi_assets' y 'bavi_variants' (v2.0)
-- Generado: ${new Date().toISOString()}
-- Ejecute este script en el Editor SQL de Supabase para garantizar la alineación.
-- ============================================================================

-- SENTENCIA 1: Asegurar la existencia de las columnas 'status' y 'description' en 'bavi_assets'.
-- Estas columnas ya existen, pero el comando 'ADD COLUMN IF NOT EXISTS' garantiza la idempotencia.
ALTER TABLE public.bavi_assets
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'pending')),
ADD COLUMN IF NOT EXISTS description TEXT;

-- SENTENCIA 2: Asegurar la integridad de la clave foránea en 'bavi_variants'.
-- Se elimina y recrea la restricción para garantizar que ON DELETE CASCADE esté presente.
ALTER TABLE public.bavi_variants
DROP CONSTRAINT IF EXISTS bavi_variants_asset_id_fkey,
ADD CONSTRAINT bavi_variants_asset_id_fkey
FOREIGN KEY (asset_id) REFERENCES public.bavi_assets(asset_id) ON DELETE CASCADE;

-- SENTENCIA 3: Fortalecer las políticas RLS para gestión.
DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar activos" ON public.bavi_assets;
CREATE POLICY "Los miembros del workspace pueden gestionar activos"
ON public.bavi_assets FOR ALL
USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "Los miembros del workspace pueden gestionar variantes" ON public.bavi_variants;
CREATE POLICY "Los miembros del workspace pueden gestionar variantes"
ON public.bavi_variants FOR ALL
USING (public.is_workspace_member((SELECT ba.workspace_id FROM public.bavi_assets ba WHERE ba.asset_id = bavi_variants.asset_id)));


-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================
  `;

  console.log(
    "\n\n-- COPIE Y PEGUE EL SIGUIENTE SQL EN EL EDITOR DE SUPABASE --\n"
  );
  console.log(migrationQueries);
  console.log("\n-- FIN DEL SCRIPT SQL --\n\n");

  scriptLogger.success(
    "El script SQL de nivelación para BAVI ha sido generado en la consola."
  );
  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
}

generateBaviLevelingSql();
