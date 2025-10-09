// src/shared/lib/actions/bavi/getBaviI18nContent.action.ts
/**
 * @file getBaviI18nContent.action.ts
 * @description Server Action para obtener el contenido i18n del ecosistema BAVI.
 * @version 4.0.0 (Holistic & Contract-Compliant)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// --- [INICIO DE NIVELACIÓN DE CONTRATO v4.0.0] ---
// El contrato ahora es holístico e incluye todas las piezas de contenido requeridas.
export type BaviI18nContent = {
  baviHomePage: NonNullable<Dictionary["baviHomePage"]>;
  baviUploader: NonNullable<Dictionary["baviUploader"]>;
  assetExplorer: NonNullable<Dictionary["assetExplorer"]>;
  promptCreator: NonNullable<Dictionary["promptCreator"]>;
  baviHeader: NonNullable<Dictionary["baviHeader"]>; // Propiedad añadida
  sesaOptions: NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
};
// --- [FIN DE NIVELACIÓN DE CONTRATO v4.0.0] ---

export async function getBaviI18nContentAction(
  locale: Locale
): Promise<ActionResult<BaviI18nContent>> {
  const traceId = logger.startTrace("getBaviI18nContentAction_v4.0");
  const groupId = logger.startGroup(
    `[Action] Obteniendo contenido i18n para BAVI [${locale}]...`,
    traceId
  );

  try {
    const { dictionary, error } = await getDictionary(locale);
    if (error)
      throw new Error("No se pudo cargar el diccionario base.", {
        cause: error,
      });

    // --- [INICIO DE NIVELACIÓN DE LÓGICA v4.0.0] ---
    const {
      baviHomePage,
      baviUploader,
      assetExplorer,
      promptCreator,
      baviHeader,
    } = dictionary;

    // Guardián de Resiliencia Holístico
    if (
      !baviHomePage ||
      !baviUploader ||
      !assetExplorer ||
      !promptCreator?.sesaOptions ||
      !baviHeader
    ) {
      const missingKeys = [
        !baviHomePage && "baviHomePage",
        !baviUploader && "baviUploader",
        !assetExplorer && "assetExplorer",
        !promptCreator && "promptCreator",
        !baviHeader && "baviHeader",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(`Contenido i18n incompleto. Faltan: ${missingKeys}.`);
    }

    logger.success("[Action] Contenido i18n para BAVI obtenido con éxito.", {
      traceId,
    });
    return {
      success: true,
      data: {
        baviHomePage,
        baviUploader,
        assetExplorer,
        promptCreator,
        baviHeader, // La propiedad ahora se incluye en la respuesta
        sesaOptions: promptCreator.sesaOptions,
      },
    };
    // --- [FIN DE NIVELACIÓN DE LÓGICA v4.0.0] ---
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al obtener contenido i18n para BAVI.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
