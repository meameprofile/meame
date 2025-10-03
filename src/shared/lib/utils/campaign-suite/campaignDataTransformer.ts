// app/[locale]/(dev)/dev/campaign-suite/_actions/_utils/campaignDataTransformer.ts
/**
 * @file campaignDataTransformer.ts
 * @description Utilidad pura para transformar el borrador de campaña en el objeto de contenido final.
 * @version 2.0.0 (FSD Architecture Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { supportedLocales, type Locale } from "@/shared/lib/i18n/i18n.config";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { logger } from "@/shared/lib/logging";

/**
 * @function transformDraftToContentObject
 * @description Transforma los datos de contenido del borrador en un objeto de contenido
 *              listo para ser serializado a JSON. Es una función pura y sin efectos secundarios.
 * @param {CampaignDraft} draft El estado completo del borrador de la campaña.
 * @returns {Partial<Record<Locale, Record<string, unknown>>>} El objeto de contenido final,
 *          estructurado por locale y clave de diccionario de sección.
 */
export function transformDraftToContentObject(
  draft: CampaignDraft
): Partial<Record<Locale, Record<string, unknown>>> {
  logger.trace(
    "[Transformer] Iniciando transformación de borrador a objeto de contenido..."
  );
  const contentObject: Partial<Record<Locale, Record<string, unknown>>> = {};
  const { contentData, layoutConfig } = draft;

  for (const locale of supportedLocales) {
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
        contentObject[locale]![sectionKey] = contentData[section.name][locale];
      }
    }
  }
  logger.success(
    "[Transformer] Transformación de contenido completada con éxito."
  );
  return contentObject;
}
// app/[locale]/(dev)/dev/campaign-suite/_actions/_utils/campaignDataTransformer.ts
