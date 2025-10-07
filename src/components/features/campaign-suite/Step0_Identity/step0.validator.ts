// RUTA: src/components/features/campaign-suite/Step0_Identity/step0.validator.ts
/**
 * @file step0.validator.ts
 * @description SSoT para la lógica de validación de completitud del Paso 0.
 *              Es una función pura, desacoplada de la UI, que actúa como
 *              un guardián de la lógica de negocio.
 * @version 1.0.0 (Forged & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
import {
  step0Schema,
  type Step0Data,
} from "@/shared/lib/schemas/campaigns/steps/step0.schema";

/**
 * @function validateStep0
 * @description Valida si los datos del Paso 0 son completos y válidos
 *              para permitir al usuario avanzar al siguiente paso.
 * @param {Step0Data} data - Los datos del formulario del Paso 0.
 * @returns {{ isValid: boolean; message?: string }} Un objeto que indica si el
 *          paso es válido y un mensaje de error específico si no lo es.
 */
export const validateStep0 = (
  data: Step0Data
): { isValid: boolean; message?: string } => {
  const validation = step0Schema.safeParse(data);

  if (!validation.success) {
    // Devuelve el primer error encontrado para una UX clara y directa.
    const firstError = validation.error.errors[0]?.message;
    return {
      isValid: false,
      message: firstError || "Por favor, completa todos los campos requeridos.",
    };
  }

  return { isValid: true };
};
