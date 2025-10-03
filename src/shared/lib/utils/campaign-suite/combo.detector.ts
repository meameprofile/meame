// RUTA: src/shared/lib/utils/campaign-suite/combo.detector.ts
/**
 * @file combo.detector.ts
 * @description Motor de lógica pura para la detección de Combos Estratégicos.
 * @version 2.0.0 (Type Contract Synchronization)
 * @author RaZ Podestá - MetaShark Tech
 */
import {
  strategicCombos,
  type StrategicCombo,
} from "@/shared/lib/config/strategic-combos.config";
import type { SectionName } from "@/shared/lib/config/sections.config";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";

/**
 * @function detectStrategicCombos
 * @description Analiza el layout actual y devuelve cualquier combo estratégico que se haya formado.
 * @param {LayoutConfigItem[]} layout - El layout actual de la campaña.
 * @param {SectionName} newSection - La sección que se acaba de añadir o la última del combo.
 * @returns {StrategicCombo | null} El combo detectado o null.
 */
export function detectStrategicCombos(
  layout: LayoutConfigItem[],
  newSection: SectionName
): StrategicCombo | null {
  const currentSectionNames = layout.map(
    (section: LayoutConfigItem) => section.name
  );

  logger.trace("[ComboDetector] Verificando combos estratégicos...", {
    lastAdded: newSection,
    layout: currentSectionNames,
  });

  for (const combo of strategicCombos) {
    if (combo.sections[combo.sections.length - 1] !== newSection) {
      continue;
    }

    const hasAllSections = combo.sections.every((requiredSection) =>
      currentSectionNames.includes(requiredSection)
    );

    if (hasAllSections) {
      logger.success(`[ComboDetector] ¡Combo '${combo.name}' detectado!`);
      return combo;
    }
  }

  return null;
}
