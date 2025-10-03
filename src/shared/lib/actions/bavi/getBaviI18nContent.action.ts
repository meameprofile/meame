// RUTA: src/shared/lib/actions/bavi/getBaviI18nContent.action.ts
/**
 * @file getBaviI18nContent.action.ts
 * @description Server Action soberana para obtener todo el contenido i18n
 *              necesario para el ecosistema BAVI en el cliente.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
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
  logger.info(
    `[getBaviI18nContentAction] Solicitando contenido i18n para BAVI [locale: ${locale}]`
  );

  const { dictionary, error } = await getDictionary(locale);

  if (error) {
    return { success: false, error: "No se pudo cargar el diccionario base." };
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
    return {
      success: false,
      error: `El contenido i18n para la BAVI está incompleto. Faltan: ${missingKeys}.`,
    };
  }

  return {
    success: true,
    data: {
      baviUploader,
      assetExplorer,
      sesaOptions: promptCreator.sesaOptions,
    },
  };
}
