// RUTA: src/shared/lib/bavi/manifest.queries.ts
/**
 * @file manifest.queries.ts
 * @description SSoT para las operaciones de lectura de la BAVI. Es agnóstico
 *              al contexto y seguro para su uso tanto en Server Components
 *              como en scripts de Node.js.
 * @version 8.0.0 (DB Schema Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";

import { logger } from "@/shared/lib/logging";
import {
  BaviAssetSchema,
  type BaviAsset,
  type BaviManifest,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { createServerClient } from "@/shared/lib/supabase/server";

/**
 * @interface SupabaseBaviVariant
 * @description Contrato de tipo que modela la estructura de una fila de la
 *              tabla 'bavi_variants' en Supabase.
 */
interface SupabaseBaviVariant {
  variant_id: string;
  public_id: string;
  state: "orig" | "enh";
  width: number;
  height: number;
}

/**
 * @interface SupabaseBaviAsset
 * @description Contrato de tipo que modela la estructura de una fila de la
 *              tabla 'bavi_assets' en Supabase, incluyendo su relación anidada
 *              con 'bavi_variants'.
 */
interface SupabaseBaviAsset {
  asset_id: string;
  provider: "cloudinary";
  // --- [INICIO DE NIVELACIÓN DE ESQUEMA v8.0.0] ---
  status: "active" | "archived" | "pending";
  description: string | null;
  // --- [FIN DE NIVELACIÓN DE ESQUEMA v8.0.0] ---
  prompt_id: string | null;
  tags: Partial<RaZPromptsSesaTags> | null;
  metadata: { altText?: Record<string, string> } | null;
  created_at: string;
  updated_at: string;
  bavi_variants: SupabaseBaviVariant[];
}

/**
 * @function getBaviManifestFn
 * @description Función pura que contiene la lógica central para obtener y
 *              transformar los datos del manifiesto BAVI desde Supabase.
 * @returns {Promise<BaviManifest>} El manifiesto de activos validado.
 */
const getBaviManifestFn = async (): Promise<BaviManifest> => {
  const traceId = logger.startTrace("getBaviManifestFn_v8.0");
  const supabase = createServerClient();

  const { data: assetsData, error: assetsError } = await supabase
    .from("bavi_assets")
    .select("*, bavi_variants ( * )");

  if (assetsError) {
    logger.error("[BAVI DAL] Fallo al obtener activos de Supabase.", {
      error: assetsError,
      traceId,
    });
    throw new Error(
      "No se pudo cargar la biblioteca de activos visuales desde Supabase."
    );
  }

  const validAssets: BaviAsset[] = [];
  for (const asset of (assetsData || []) as SupabaseBaviAsset[]) {
    // --- [INICIO DE NIVELACIÓN DE LÓGICA v8.0.0] ---
    // Se eliminan los valores harcodeados y se leen los datos reales de la DB.
    const transformedAsset = {
      assetId: asset.asset_id,
      status: asset.status,
      provider: asset.provider,
      description: asset.description ?? undefined,
      promptId: asset.prompt_id ?? undefined,
      tags: asset.tags ?? undefined,
      variants: asset.bavi_variants.map((v: SupabaseBaviVariant) => ({
        versionId: v.variant_id,
        publicId: v.public_id,
        state: v.state,
        dimensions: { width: v.width, height: v.height },
      })),
      metadata: asset.metadata ?? { altText: {} },
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
    };
    // --- [FIN DE NIVELACIÓN DE LÓGICA v8.0.0] ---

    const validation = BaviAssetSchema.safeParse(transformedAsset);
    if (validation.success) {
      validAssets.push(validation.data);
    } else {
      logger.error(
        `[BAVI DAL] Activo corrupto ignorado en DB: ${asset.asset_id}`,
        {
          error: validation.error.flatten(),
          traceId,
          corruptData: transformedAsset,
        }
      );
    }
  }

  logger.success(
    `[BAVI DAL v8.0] Manifiesto ensamblado con ${validAssets.length} activos válidos.`
  );
  logger.endTrace(traceId);
  return { assets: validAssets };
};

/**
 * @export getBaviManifest
 * @description Exportación soberana y agnóstica al contexto. Aplica React.cache
 *              solo si está en un entorno de Server Component, de lo contrario
 *              exporta la función asíncrona pura, haciéndola segura para scripts.
 */
export const getBaviManifest =
  typeof React.cache === "function"
    ? React.cache(getBaviManifestFn)
    : getBaviManifestFn;
