// RUTA: src/components/features/campaign-suite/Step2_Layout/step2.validator.ts
/**
 * @file step2.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 2.
 *              Este guardián de lógica de negocio asegura que un layout tenga
 *              al menos una sección antes de permitir al usuario avanzar.
 * @version 1.0.0 (Forged & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";

/**
 * @function validateStep2
 * @description Valida si el estado del Paso 2 en el borrador es completo y válido.
 * @param {CampaignDraft} draft - El estado actual del borrador de la campaña.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje de error específico si no lo es.
 *
 * @logic
 * - El layout de la campaña (`layoutConfig`) debe contener al menos una sección.
 * - Si el array de secciones está vacío, la validación falla.
 */
export const validateStep2 = (
  draft: CampaignDraft
): { isValid: boolean; message?: string } => {
  const traceId = logger.startTrace("validateStep2_v1.0");
  logger.trace("[Validator] Ejecutando validación para el Paso 2...", {
    layoutSize: draft.layoutConfig?.length,
    traceId,
  });

  if (!draft.layoutConfig || draft.layoutConfig.length === 0) {
    logger.warn("[Validator] Validación del Paso 2 fallida: layout vacío.", {
      traceId,
    });
    logger.endTrace(traceId);
    return {
      isValid: false,
      message:
        "El layout no puede estar vacío. Por favor, añade al menos una sección para continuar.",
    };
  }

  logger.success("[Validator] Validación del Paso 2 superada.", { traceId });
  logger.endTrace(traceId);
  return { isValid: true };
};
