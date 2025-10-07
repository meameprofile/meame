// RUTA: src/shared/lib/actions/bavi/_shapers/bavi.shapers.ts
/**
 * @file bavi.shapers.ts
 * @description SSoT para la transformación de datos (shaping) del dominio BAVI.
 * @version 2.0.0 (Absolute Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import {
  BaviAssetSchema,
  type BaviAsset,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type {
  BaviAssetRow,
  BaviVariantRow,
} from "@/shared/lib/schemas/bavi/bavi.contracts";
import { logger } from "@/shared/lib/logging";

// --- [INICIO DE REFACTORIZACIÓN DE TIPO SOBERANO] ---
// Contrato explícito para la fila de variante anidada.
type SupabaseBaviVariant = Pick<
  BaviVariantRow,
  "variant_id" | "public_id" | "state" | "width" | "height"
>;

// Contrato explícito para la fila de activo con sus variantes anidadas.
type BaviAssetWithVariantsRow = BaviAssetRow & {
  bavi_variants: SupabaseBaviVariant[];
};
// --- [FIN DE REFACTORIZACIÓN DE TIPO SOBERANO] ---

/**
 * @function mapSupabaseToBaviAsset
 * @description Transforma y VALIDA una fila 'bavi_assets' al contrato 'BaviAsset'.
 * @param {BaviAssetWithVariantsRow} row - La fila cruda de Supabase.
 * @param {string} [traceId] - ID de traza opcional.
 * @returns {BaviAsset} La entidad transformada y segura.
 * @throws {ZodError} Si los datos no cumplen con el schema.
 */
export function mapSupabaseToBaviAsset(
  row: BaviAssetWithVariantsRow,
  traceId?: string
): BaviAsset {
  logger.trace(`[Shaper] Transformando BaviAssetRow: ${row.asset_id}`, {
    traceId,
  });

  const transformed = {
    assetId: row.asset_id,
    status: row.status,
    provider: row.provider,
    description: row.description ?? undefined,
    promptId: row.prompt_id ?? undefined,
    tags: row.tags as Partial<RaZPromptsSesaTags> | undefined,
    variants: (row.bavi_variants || []).map((v) => ({
      versionId: v.variant_id,
      publicId: v.public_id,
      state: v.state as "orig" | "enh",
      dimensions: { width: v.width, height: v.height },
    })),
    // Se utiliza un tipo genérico pero seguro en lugar de 'any'.
    metadata: (row.metadata as Record<string, unknown>) ?? { altText: {} },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return BaviAssetSchema.parse(transformed);
}
