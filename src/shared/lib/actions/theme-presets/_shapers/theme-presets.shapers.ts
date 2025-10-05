// RUTA: src/shared/lib/actions/theme-presets/_shapers/theme-presets.shapers.ts
/**
 * @file theme-presets.shapers.ts
 * @description SSoT para la transformación de datos del dominio Theme Presets.
 * @version 1.0.0 (Sovereign & DRY)
 * @author L.I.A. Legacy
 */
import "server-only";
import {
  ThemePresetSchema,
  type ThemePreset,
} from "@/shared/lib/schemas/theme-preset.schema";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type { ThemePresetRow } from "@/shared/lib/schemas/theme-presets/theme-presets.contracts";
import { logger } from "@/shared/lib/logging";

/**
 * @function mapSupabaseToThemePreset
 * @description Transforma y VALIDA una fila 'theme_presets' al contrato de la aplicación.
 * @param {ThemePresetRow} row - La fila cruda de Supabase.
 * @param {string} [traceId] - ID de traza opcional para logging correlacionado.
 * @returns {ThemePreset} La entidad transformada y garantizada como segura.
 * @throws {ZodError} Si los datos de la fila no cumplen con el schema.
 */
export function mapSupabaseToThemePreset(
  row: ThemePresetRow,
  traceId?: string
): ThemePreset {
  logger.trace(`[Shaper] Transformando ThemePresetRow: ${row.id}`, { traceId });

  // Se realiza la transformación de snake_case a camelCase.
  const transformed = {
    id: row.id,
    workspaceId: row.workspace_id,
    userId: row.user_id,
    name: row.name,
    description: row.description || undefined,
    type: row.type,
    themeConfig: row.theme_config as ThemeConfig,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  // El .parse() actúa como un guardián de contrato estricto.
  return ThemePresetSchema.parse(transformed);
}
