// RUTA: src/components/features/campaign-suite/Step1_Structure/step1.validator.ts
/**
 * @file step1.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 1, ahora
 *              alineado con la arquitectura de "Forja Centralizada".
 * @version 2.0.0 (Centralized Forge Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";

/**
 * @function validateStep1
 * @description Valida si el estado del Paso 1 en el borrador es completo y válido.
 * @param {CampaignDraft} draft - El estado actual del borrador de la campaña.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje opcional para el tooltip.
 */
export const validateStep1 = (
  draft: CampaignDraft
): { isValid: boolean; message?: string } => {
  const traceId = logger.startTrace("validateStep1_v2.0");
  logger.trace("[Validator] Ejecutando validación para el Paso 1...", {
    draftId: draft.draftId,
    traceId,
  });

  const { headerConfig, footerConfig } = draft;

  if (headerConfig.useHeader && !headerConfig.componentName) {
    const message = "Selecciona un estilo de Encabezado para continuar.";
    logger.warn(`[Validator] Validación del Paso 1 fallida: ${message}`, {
      traceId,
    });
    logger.endTrace(traceId);
    return {
      isValid: false,
      message,
    };
  }

  if (footerConfig.useFooter && !footerConfig.componentName) {
    const message = "Selecciona un estilo de Pie de Página para continuar.";
    logger.warn(`[Validator] Validación del Paso 1 fallida: ${message}`, {
      traceId,
    });
    logger.endTrace(traceId);
    return {
      isValid: false,
      message,
    };
  }

  logger.success("[Validator] Validación del Paso 1 superada.", { traceId });
  logger.endTrace(traceId);
  return { isValid: true };
};
