// RUTA: src/shared/lib/actions/raz-prompts/_shapers/raz-prompts.shapers.ts
/**
 * @file raz-prompts.shapers.ts
 * @description SSoT para la transformación de datos (shaping) del dominio RaZPrompts.
 * @version 1.0.0 (Sovereign & Type-Safe)
 * @author L.I.A. Legacy
 */
import "server-only";
import {
  RaZPromptsEntrySchema,
  type RaZPromptsEntry,
} from "@/shared/lib/schemas/raz-prompts/entry.schema";
import type { RazPromptsEntryRow } from "@/shared/lib/schemas/raz-prompts/raz-prompts.contracts";
import { logger } from "@/shared/lib/logging";

/**
 * @function mapSupabaseToCamelCase
 * @description Transforma y VALIDA una fila 'razprompts_entries' al contrato de la aplicación.
 * @param {RazPromptsEntryRow} row - La fila cruda de Supabase.
 * @param {string} [traceId] - ID de traza opcional.
 * @returns {RaZPromptsEntry} La entidad transformada y segura.
 * @throws {ZodError} Si los datos no cumplen con el schema.
 */
export function mapSupabaseToCamelCase(
  row: RazPromptsEntryRow,
  traceId?: string
): RaZPromptsEntry {
  logger.trace(`[Shaper] Transformando RazPromptsEntryRow: ${row.id}`, {
    traceId,
  });

  const transformed = {
    promptId: row.id,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    title: row.title,
    status: row.status,
    aiService: row.ai_service,
    keywords: row.keywords,
    versions: row.versions,
    tags: row.tags,
    baviAssetIds: row.bavi_asset_ids,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return RaZPromptsEntrySchema.parse(transformed);
}
