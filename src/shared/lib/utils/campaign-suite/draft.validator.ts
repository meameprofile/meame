// RUTA: src/shared/lib/utils/campaign-suite/draft.validator.ts
/**
 * @file draft.validator.ts
 * @description SSoT para la lógica de validación de un borrador de campaña
 *              antes de su publicación. Es una función pura y sin efectos secundarios.
 * @version 2.0.0 (Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
  helpText: string;
}

export function validateDraftForLaunch(draft: CampaignDraft): ChecklistItem[] {
  logger.trace("[DraftValidator] Ejecutando checklist de pre-lanzamiento...");
  const checklist: ChecklistItem[] = [];

  // Regla 1: Identidad Básica Definida
  const isIdentityComplete = !!(
    draft.baseCampaignId &&
    draft.variantName &&
    draft.seoKeywords
  );
  checklist.push({
    id: "identity",
    label: "Identidad de la campaña definida",
    isCompleted: isIdentityComplete,
    helpText: "Asegúrate de haber completado todos los campos en el Paso 0.",
  });

  // Regla 2: Layout Configurado
  const isLayoutComplete = draft.layoutConfig.length > 0;
  checklist.push({
    id: "layout",
    label: "Layout de página compuesto",
    isCompleted: isLayoutComplete,
    helpText: "Añade al menos una sección en el Paso 2 para continuar.",
  });

  // Regla 3: Tema Visual Seleccionado
  const isThemeComplete = !!(
    draft.themeConfig.colorPreset &&
    draft.themeConfig.fontPreset &&
    draft.themeConfig.radiusPreset
  );
  checklist.push({
    id: "theme",
    label: "Tema visual seleccionado",
    isCompleted: isThemeComplete,
    helpText:
      "Selecciona una paleta de colores, tipografía y geometría en el Paso 3.",
  });

  // Regla 4: Contenido del Locale Principal Relleno
  let isContentComplete = isLayoutComplete;
  if (isLayoutComplete) {
    for (const section of draft.layoutConfig) {
      const sectionContent = draft.contentData[section.name]?.[defaultLocale];
      if (!sectionContent || Object.keys(sectionContent).length === 0) {
        isContentComplete = false;
        break;
      }
    }
  }
  checklist.push({
    id: "content",
    label: `Contenido para el idioma principal (${defaultLocale}) completo`,
    isCompleted: isContentComplete,
    helpText: `Asegúrate de rellenar el contenido para todas las secciones en el idioma por defecto (${defaultLocale}) en el Paso 4.`,
  });

  logger.trace("[DraftValidator] Checklist completado.", {
    completed: checklist.filter((c) => c.isCompleted).length,
    total: checklist.length,
  });
  return checklist;
}
