// RUTA: src/shared/lib/actions/bavi/getBaviI18nContent.action.ts
/**
 * @file getBaviI18nContent.action.ts
 * @description Server Action para obtener el contenido i18n del ecosistema BAVI.
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use server";

import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

export type BaviI18nContent = {
  baviUploader: NonNullable<Dictionary["baviUploader"]>;
  assetExplorer: NonNullable<Dictionary["assetExplorer"]>;
  sesaOptions: NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
};

export async function getBaviI18nContentAction(
  locale: Locale
): Promise<ActionResult<BaviI18nContent>> {
  const traceId = logger.startTrace("getBaviI18nContentAction_v2.0");
  logger.startGroup(
    `[Action] Obteniendo contenido i18n para BAVI [${locale}]...`,
    traceId
  );

  try {
    const { dictionary, error } = await getDictionary(locale);

    if (error) {
      throw new Error("No se pudo cargar el diccionario base.", {
        cause: error,
      });
    }

    const { baviUploader, assetExplorer, promptCreator } = dictionary;

    if (!baviUploader || !assetExplorer || !promptCreator?.sesaOptions) {
      const missingKeys = [
        !baviUploader && "baviUploader",
        !assetExplorer && "assetExplorer",
        !promptCreator?.sesaOptions && "promptCreator.sesaOptions",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `El contenido i18n para la BAVI está incompleto. Faltan: ${missingKeys}.`
      );
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    logger.success("[Action] Contenido i18n para BAVI obtenido con éxito.", {
      traceId,
    });
    return {
      success: true,
      data: {
        baviUploader,
        assetExplorer,
        sesaOptions: promptCreator.sesaOptions,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al obtener contenido i18n para BAVI.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
