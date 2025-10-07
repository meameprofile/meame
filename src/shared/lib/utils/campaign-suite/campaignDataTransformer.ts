// RUTA: src/shared/lib/utils/campaign-suite/campaignDataTransformer.ts
/**
 * @file campaignDataTransformer.ts
 * @description Utilidad pura para transformar el borrador de campaña en el objeto de contenido final.
 * @version 4.0.0 (Absolute Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import {
  ROUTING_LOCALES as supportedLocales,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { logger } from "@/shared/lib/logging";

export function transformDraftToContentObject(
  draft: CampaignDraft
): Partial<Record<Locale, Record<string, unknown>>> {
  logger.trace(
    "[Transformer] Iniciando transformación de borrador a objeto de contenido (v4.0)..."
  );
  const contentObject: Partial<Record<Locale, Record<string, unknown>>> = {};
  const { contentData, layoutConfig } = draft;

  // --- [INICIO DE REFACTORIZACIÓN DE PRECISIÓN DE TIPO v4.0.0] ---
  // Se aplica la coerción de doble casteo para convertir el tuple 'readonly' a un array mutable seguro.
  for (const locale of supportedLocales as unknown as Locale[]) {
    // --- [FIN DE REFACTORIZACIÓN DE PRECISIÓN DE TIPO v4.0.0] ---
    contentObject[locale] = {};
    for (const section of layoutConfig) {
      const sectionKey =
        sectionsConfig[section.name as keyof typeof sectionsConfig]
          ?.dictionaryKey;
      if (
        sectionKey &&
        contentData[section.name] &&
        contentData[section.name][locale]
      ) {
        logger.trace(
          `[Transformer] Mapeando sección '${section.name}' a clave '${sectionKey}' para locale [${locale}].`
        );
        contentObject[locale]![sectionKey] = contentData[section.name][locale]!;
      }
    }
  }
  logger.success(
    "[Transformer] Transformación de contenido completada con éxito."
  );
  return contentObject;
}
