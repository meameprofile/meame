// RUTA: src/shared/lib/utils/campaign-suite/preview.utils.ts
/**
 * @file preview.utils.ts
 * @description Utilidades del lado del cliente para ensamblar los datos de la vista previa,
 *              ahora forjado con un Guardián de Resiliencia y Observabilidad de élite.
 * @version 3.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import type {
  ContentData,
  LayoutConfigItem,
} from "@/shared/lib/types/campaigns/draft.types";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

/**
 * @function buildPreviewDictionary
 * @description Transforma los datos de contenido del borrador en un diccionario
 *              parcial que el SectionRenderer puede consumir.
 */
export function buildPreviewDictionary(
  contentData: ContentData,
  layoutConfig: LayoutConfigItem[],
  locale: Locale,
  sectionsConfig: Record<string, { dictionaryKey: string }>
): Partial<Dictionary> {
  const traceId = logger.startTrace("buildPreviewDictionary_v3.0");
  logger.info("[PreviewUtil] Ensamblando diccionario de previsualización...", {
    traceId,
    locale,
    sectionCount: layoutConfig?.length || 0,
  });

  try {
    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (!contentData || !layoutConfig || !sectionsConfig) {
      logger.error(
        "[Guardián] Entradas inválidas para buildPreviewDictionary. Retornando diccionario vacío.",
        { traceId, hasContentData: !!contentData, hasLayout: !!layoutConfig }
      );
      return {};
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

    const dictionary: Partial<Dictionary> = {};

    for (const section of layoutConfig) {
      const sectionKey =
        sectionsConfig[section.name as keyof typeof sectionsConfig]
          ?.dictionaryKey;

      if (
        sectionKey &&
        contentData[section.name] &&
        contentData[section.name][locale]
      ) {
        logger.traceEvent(
          traceId,
          `Mapeando sección '${section.name}' a clave de diccionario '${sectionKey}'.`
        );
        (dictionary as Record<string, unknown>)[sectionKey] =
          contentData[section.name][locale];
      }
    }

    logger.success(
      `[PreviewUtil] Diccionario de previsualización ensamblado con ${
        Object.keys(dictionary).length
      } claves.`,
      { traceId }
    );
    return dictionary;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[PreviewUtil] Fallo crítico durante el ensamblaje del diccionario de previsualización.",
      { error: errorMessage, traceId }
    );
    return {}; // Retornar un objeto vacío en caso de error inesperado
  } finally {
    logger.endTrace(traceId);
  }
}
