// RUTA: src/shared/lib/config/raz-prompts/parameters.config.ts
/**
 * @file parameters.config.ts
 * @description SSoT para la configuración de los parámetros de generación de Ideogram.
 * @version 2.1.0 (Elite Code Hygiene)
 *@author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace("[Config] Módulo de parámetros de RaZPrompts v2.1 cargado.");

export interface ParameterOption {
  value: string;
  labelKey: string;
}

export interface ParameterConfig {
  id: "styleType" | "aspectRatio";
  labelKey: string;
  placeholderKey: string;
  options: readonly ParameterOption[];
  appendToPrompt: (value: string, label: string) => string;
}

export const IDEOGRAM_PARAMETERS_CONFIG: readonly ParameterConfig[] = [
  {
    id: "styleType",
    labelKey: "styleTypeLabel",
    placeholderKey: "styleTypePlaceholder",
    options: [
      { value: "REALISTIC", labelKey: "styleRealistic" },
      { value: "DESIGN", labelKey: "styleDesign" },
      { value: "FICTION", labelKey: "styleFiction" },
      { value: "GENERAL", labelKey: "styleGeneral" },
      { value: "AUTO", labelKey: "styleAuto" },
    ],
    // Esta implementación solo necesita el 'label', por lo que ignoramos 'value'.
    appendToPrompt: (_value, label) => `${label.toLowerCase()}`,
  },
  {
    id: "aspectRatio",
    labelKey: "aspectRatioLabel",
    placeholderKey: "aspectRatioPlaceholder",
    options: [
      { value: "16x9", labelKey: "aspectRatio16x9" },
      { value: "9x16", labelKey: "aspectRatio9x16" },
      { value: "1x1", labelKey: "aspectRatio1x1" },
    ],
    // --- [INICIO DE REFACTORIZACIÓN DE HIGIENE DE CÓDIGO] ---
    // Esta implementación solo necesita el 'value', por lo que ignoramos 'label'.
    appendToPrompt: (value) => `aspect ratio ${value}`,
    // --- [FIN DE REFACTORIZACIÓN DE HIGIENE DE CÓDIGO] ---
  },
] as const;
