// RUTA: src/shared/lib/actions/campaign-suite/getLivePreviewAssets.action.ts
/**
 * @file getLivePreviewAssets.action.ts
 * @description Server Action soberana para obtener los datos necesarios
 *              para la hidratación del LivePreviewCanvas (EDVI).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { getBaviManifest } from "@/shared/lib/bavi";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";

interface LivePreviewAssets {
  baviManifest: BaviManifest;
  dictionary: Dictionary;
}

export async function getLivePreviewAssetsAction(): Promise<
  ActionResult<LivePreviewAssets>
> {
  try {
    const [baviManifest, { dictionary, error }] = await Promise.all([
      getBaviManifest(),
      getDictionary(defaultLocale), // Usamos un locale por defecto para la previsualización
    ]);

    if (error || !dictionary) {
      throw new Error(
        "No se pudo cargar el diccionario para la previsualización."
      );
    }

    return {
      success: true,
      data: { baviManifest, dictionary: dictionary as Dictionary },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[getLivePreviewAssets] Fallo al obtener los activos.", {
      error: errorMessage,
    });
    return {
      success: false,
      error: "No se pudieron cargar los datos de previsualización.",
    };
  }
}
