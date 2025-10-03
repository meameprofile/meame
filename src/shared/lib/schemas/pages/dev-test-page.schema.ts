// lib/schemas/pages/dev-test-page.schema.ts
/**
 * @file dev-test-page.schema.ts
 * @description Esquema de Zod para el contenido i18n de la página de prueba del DCC.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DevTestPageLocaleSchema = z.object({
  devTestPage: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      selectThemeLabel: z.string(),
      noContentWarning: z.string(),
      // Textos de fallback para componentes si no tienen i18n específico
      fallbackHeroTitle: z.string(),
      fallbackHeroSubtitle: z.string(),
      fallbackBenefitsTitle: z.string(),
      fallbackBenefitsSubtitle: z.string(),
      fallbackBenefit1: z.string(),
      fallbackBenefit2: z.string(),
      fallbackBenefit3: z.string(),
      fallbackAccordionQuestion: z.string(),
      fallbackAccordionAnswer: z.string(),
      fallbackOrderNameLabel: z.string(),
      fallbackOrderNamePlaceholder: z.string(),
      fallbackOrderPhoneLabel: z.string(),
      fallbackOrderPhonePlaceholder: z.string(),
      fallbackOrderSubmitText: z.string(),
      fallbackOrderLoadingText: z.string(),
    })
    .optional(),
});
