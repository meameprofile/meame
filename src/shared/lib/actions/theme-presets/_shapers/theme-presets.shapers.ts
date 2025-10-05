// RUTA: src/shared/lib/actions/theme-presets/_shapers/theme-presets.shapers.ts
/**
 * @file theme-presets.shapers.ts
 * @description Módulo soberano para la transformación de datos (shaping) del dominio Theme Presets.
 *              Esta es la SSoT para convertir datos de la DB al contrato de la aplicación.
 * @version 1.0.0 (Sovereign & DRY)
 * @author RaZ Podestá - MetaShark Tech
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
 * @description Transforma una fila 'theme_presets' de Supabase a la entidad 'ThemePreset' de la aplicación.
 * @param {ThemePresetRow} row - La fila cruda de la base de datos.
 * @returns {ThemePreset} La entidad transformada y validada.
 * @throws {ZodError} Si la fila transformada no cumple con el ThemePresetSchema.
 */
export function mapSupabaseToThemePreset(row: ThemePresetRow): ThemePreset {
  logger.trace(`[Shaper] Transformando ThemePresetRow: ${row.id}`);
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
  // El .parse() actúa como un guardián de contrato en la capa de transformación.
  return ThemePresetSchema.parse(transformed);
}
