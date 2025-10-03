// scripts/supabase/migrations/003_level_razprompts_table.ts
// EJECUTE: pnpm tsx scripts/supabase/migrations/003_level_razprompts_table.ts
// VERIFICACION: pnpm diag:supabase:schema-razprompts

/**
 * @file 003_level_razprompts_table.ts
 * @description Script generador de SQL para alinear la tabla `razprompts_entries`
 *              con su manifiesto soberano v2.0.
 * @version 1.0.0 (SQL Generator)
 * @author L.I.A. Legacy
 */
import { scriptLogger } from "../../_utils/logger";

function generateRazPromptsLevelingSql() {
  const traceId = scriptLogger.startTrace("generateRazPromptsLevelingSql");
  scriptLogger.startGroup(
    "Generando SQL de nivelación para `razprompts_entries`..."
  );

  const migrationQueries = `
-- ============================================================================
-- MIGRACIÓN QUIRÚRGICA PARA LA TABLA 'razprompts_entries' (v2.0)
-- Generado: ${new Date().toISOString()}
-- Ejecute este script en el Editor SQL de Supabase para cerrar la brecha de
-- seguridad y añadir la automatización del timestamp.
-- ============================================================================

-- SENTENCIA 1: Fortalecer las políticas RLS para una gestión segura y unificada.
-- Se eliminan todas las políticas existentes y se crea una única política 'ALL'
-- que gobierna SELECT, INSERT, UPDATE y DELETE, forzando la verificación de membresía.
DROP POLICY IF EXISTS "Los miembros del workspace pueden ver las entradas de prompt" ON public.razprompts_entries;
DROP POLICY IF EXISTS "Los miembros del workspace pueden crear entradas de prompt" ON public.razprompts_entries;
DROP POLICY IF EXISTS "Los miembros del workspace pueden actualizar sus entradas de pr" ON public.razprompts_entries;
DROP POLICY IF EXISTS "Los miembros del workspace pueden eliminar sus entradas de prom" ON public.razprompts_entries;

CREATE POLICY "Los miembros del workspace pueden gestionar sus prompts"
ON public.razprompts_entries FOR ALL
USING (public.is_workspace_member(workspace_id))
WITH CHECK (public.is_workspace_member(workspace_id));


-- SENTENCIA 2: Asegurar la existencia del trigger 'updated_at'.
CREATE OR REPLACE TRIGGER on_razprompt_update
BEFORE UPDATE ON public.razprompts_entries
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

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
    "El script SQL de nivelación para RaZPrompts ha sido generado en la consola."
  );
  scriptLogger.endGroup();
  scriptLogger.endTrace(traceId);
}

generateRazPromptsLevelingSql();
