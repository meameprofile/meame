// lib/i18n/campaign.data.processor.ts
/**
 * @file campaign.data.processor.ts
 * @description Aparato Atómico: Procesador de Datos de Campaña.
 *              v4.0.0 (Type Safety): Erradica el uso de 'any', forzando
 *              un contrato de tipos más estricto y seguro.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { type Dictionary } from "@/shared/lib/schemas/i18n.schema";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { logger } from "@/shared/lib/logging";

/**
 * @function processCampaignData
 * @description Fusiona diccionarios y valida los datos finales de la campaña.
 * @param globalDictionary El diccionario base del portal.
 * @param campaignLocaleContent El contenido específico de la campaña para el locale actual.
 * @param finalAssembledTheme El objeto de tema final, ya fusionado.
 * @returns {{ dictionary: Dictionary, theme: AssembledTheme }} Los datos procesados.
 * @throws {Error} Si la validación del tema falla.
 */
export function processCampaignData(
  globalDictionary: Dictionary,
  // --- [INICIO DE CORRECCIÓN DE TIPO] ---
  campaignLocaleContent: Record<string, unknown>, // Se usa 'unknown' en lugar de 'any'
  finalAssembledTheme: unknown // Se usa 'unknown' en lugar de 'any'
  // --- [FIN DE CORRECCIÓN DE TIPO] ---
): { dictionary: Dictionary; theme: AssembledTheme } {
  logger.trace(`[Procesador] Procesando y validando datos de campaña...`);

  const fullMergedDictionary = {
    ...globalDictionary,
    ...campaignLocaleContent,
  };

  const themeValidation = AssembledThemeSchema.safeParse(finalAssembledTheme);
  if (!themeValidation.success) {
    logger.error(`[Procesador] Error de validación del tema ensamblado:`, {
      errors: themeValidation.error.flatten().fieldErrors,
    });
    throw new Error("El tema final de la campaña es inválido.");
  }

  logger.trace(`[Procesador] Datos validados exitosamente.`);
  return {
    dictionary: fullMergedDictionary as Dictionary,
    theme: themeValidation.data,
  };
}
// lib/i18n/campaign.data.processor.ts
