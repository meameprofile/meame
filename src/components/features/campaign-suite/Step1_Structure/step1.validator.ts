// app/[locale]/(dev)/dev/campaign-suite/_components/Step1_Structure/step1.validator.ts
/**
 * @file step1.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 1.
 *              Es una función pura, desacoplada de la UI.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

/**
 * @function validateStep1
 * @description Valida si el estado del Paso 1 en el borrador es completo y válido
 *              para permitir al usuario avanzar.
 * @param {CampaignDraft} draft - El estado actual del borrador de la campaña.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje opcional para el tooltip.
 *
 * @logic
 * - Si el header está activado (`useHeader`), debe haber un `componentName` seleccionado.
 * - Si el footer está activado (`useFooter`), debe haber un `componentName` seleccionado.
 * - Si ambos están desactivados, se considera válido (es una decisión estratégica).
 */
export const validateStep1 = (
  draft: CampaignDraft
): { isValid: boolean; message?: string } => {
  const { headerConfig, footerConfig } = draft;

  if (headerConfig.useHeader && !headerConfig.componentName) {
    return {
      isValid: false,
      message: "Selecciona un estilo de Encabezado para continuar.",
    };
  }

  if (footerConfig.useFooter && !footerConfig.componentName) {
    return {
      isValid: false,
      message: "Selecciona un estilo de Pie de Página para continuar.",
    };
  }

  return { isValid: true };
};
// app/[locale]/(dev)/dev/campaign-suite/_components/Step1_Structure/step1.validator.ts
