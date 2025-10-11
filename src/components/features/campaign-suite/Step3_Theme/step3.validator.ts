// RUTA: src/components/features/campaign-suite/Step3_Theme/step3.validator.ts
/**
 * @file step3.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 3.
 *              Este guardián de lógica de negocio asegura que se haya
 *              seleccionado una configuración de tema visual completa.
 * @version 1.0.0 (Forged & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

/**
 * @function validateStep3
 * @description Valida si el estado del Paso 3 en el borrador es completo y válido.
 * @param {CampaignDraft} draft - El estado actual del borrador de la campaña.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje de error específico si no lo es.
 *
 * @logic
 * - La configuración del tema (`themeConfig`) debe tener valores seleccionados
 *   para `colorPreset`, `fontPreset` y `radiusPreset`.
 * - Si alguna de estas tres propiedades es nula o indefinida, la validación falla.
 */
export const validateStep3 = (
  draft: CampaignDraft
): { isValid: boolean; message?: string } => {
  const traceId = logger.startTrace("validateStep3_v1.0");
  const { themeConfig } = draft;

  logger.trace("[Validator] Ejecutando validación para el Paso 3...", {
    themeConfig,
    traceId,
  });

  if (!themeConfig.colorPreset) {
    const message =
      "Por favor, selecciona una paleta de colores para continuar.";
    logger.warn(`[Validator] Validación del Paso 3 fallida: ${message}`, {
      traceId,
    });
    logger.endTrace(traceId);
    return { isValid: false, message };
  }

  if (!themeConfig.fontPreset) {
    const message =
      "Por favor, selecciona un set de tipografía para continuar.";
    logger.warn(`[Validator] Validación del Paso 3 fallida: ${message}`, {
      traceId,
    });
    logger.endTrace(traceId);
    return { isValid: false, message };
  }

  if (!themeConfig.radiusPreset) {
    const message =
      "Por favor, selecciona un estilo de geometría (radios) para continuar.";
    logger.warn(`[Validator] Validación del Paso 3 fallida: ${message}`, {
      traceId,
    });
    logger.endTrace(traceId);
    return { isValid: false, message };
  }

  logger.success("[Validator] Validación del Paso 3 superada.", { traceId });
  logger.endTrace(traceId);
  return { isValid: true };
};
