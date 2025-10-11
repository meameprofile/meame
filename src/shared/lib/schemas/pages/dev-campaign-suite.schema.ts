// RUTA: src/shared/lib/schemas/pages/dev-campaign-suite.schema.ts
/**
 * @file dev-campaign-suite.schema.ts
 * @description SSoT para el contenido i18n de la SDC.
 * @version 10.0.0 (Template Suffix Integration)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import {
  Step0ContentSchema,
  Step1ContentSchema,
  Step2ContentSchema,
  Step3ContentSchema,
  Step4ContentSchema,
  Step5ContentSchema,
} from "@/shared/lib/schemas/campaigns/steps";

const PreviewContentSchema = z.object({
  loadingTheme: z.string(),
  errorLoadingTheme: z.string(),
});

export const StepperTitlesSchema = z.object({
  identificationTitle: z.string(),
  structureTitle: z.string(),
  layoutTitle: z.string(),
  themeTitle: z.string(),
  contentTitle: z.string(),
  managementTitle: z.string(),
});

export const CampaignSuiteContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  // Se añade la propiedad requerida por TemplateBrowser.tsx.
  templateCopySuffix: z.string(),
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  preview: PreviewContentSchema.optional(),
  stepper: StepperTitlesSchema.optional(),
  step0: Step0ContentSchema.optional(),
  step1: Step1ContentSchema.optional(),
  step2: Step2ContentSchema.optional(),
  step3: Step3ContentSchema.optional(),
  step4: Step4ContentSchema.optional(),
  step5: Step5ContentSchema.optional(),
});

export const CampaignSuiteLocaleSchema = z.object({
  campaignSuitePage: CampaignSuiteContentSchema.optional(),
});
