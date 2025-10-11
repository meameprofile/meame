// RUTA: src/components/features/campaign-suite/Step4_Content/step4.validator.ts
/**
 * @file step4.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 4.
 *              Este guardián de lógica de negocio asegura que todas las secciones
 *              tengan contenido para el idioma principal antes de avanzar.
 * @version 1.0.0 (Forged & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

/**
 * @function validateStep4
 * @description Valida si el estado del Paso 4 en el borrador es completo y válido.
 * @param {CampaignDraft} draft - El estado actual del borrador de la campaña.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje de error específico si no lo es.
 *
 * @logic
 * - Itera a través de todas las secciones definidas en `layoutConfig`.
 * - Para cada sección, verifica si se ha introducido contenido para el `defaultLocale`.
 * - Si alguna sección carece de contenido para el locale por defecto, la validación falla.
 */
export const validateStep4 = (
  draft: CampaignDraft
): { isValid: boolean; message?: string } => {
  const traceId = logger.startTrace("validateStep4_v1.0");
  const { layoutConfig, contentData } = draft;

  logger.trace("[Validator] Ejecutando validación para el Paso 4...", {
    sections: layoutConfig.map((s) => s.name),
    localeToCheck: defaultLocale,
    traceId,
  });

  for (const section of layoutConfig) {
    const sectionContentForLocale = contentData[section.name]?.[defaultLocale];

    // El guardián verifica no solo que el objeto exista, sino que no esté vacío.
    if (
      !sectionContentForLocale ||
      Object.keys(sectionContentForLocale).length === 0
    ) {
      const message = `El contenido para la sección "${section.name}" en el idioma principal (${defaultLocale}) está incompleto. Por favor, edita la sección para añadir la información.`;
      logger.warn(`[Validator] Validación del Paso 4 fallida: ${message}`, {
        traceId,
      });
      logger.endTrace(traceId);
      return {
        isValid: false,
        message,
      };
    }
  }

  logger.success(
    "[Validator] Validación del Paso 4 superada: todo el contenido principal está presente.",
    { traceId }
  );
  logger.endTrace(traceId);
  return { isValid: true };
};
