// RUTA: src/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema.ts
/**
 * @file prompt-creator.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del
 *              componente PromptCreator.
 * @version 5.0.0 (Sovereign Type Export)
 *@author L.I.A. Legacy
 */
import { z } from "zod";

const SesaOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se exporta el tipo soberano para su consumo en componentes de UI.
export type SesaOption = z.infer<typeof SesaOptionSchema>;
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export const PromptCreatorContentSchema = z.object({
  titleLabel: z.string(),
  titlePlaceholder: z.string(),
  formDescription: z.string(),
  promptTextLabel: z.string(),
  promptTextPlaceholder: z.string(),
  enhanceAILabel: z.string(),
  enhanceAIDescription: z.string(),
  tagsGroupLabel: z.string(),
  parametersGroupLabel: z.string(),
  keywordsLabel: z.string(),
  keywordsPlaceholder: z.string(),
  keywordsDescription: z.string(),
  submitButtonText: z.string(),
  submitButtonLoadingText: z.string(),
  sesaLabels: z.object({
    ai: z.string(),
    sty: z.string(),
    fmt: z.string(),
    typ: z.string(),
    sbj: z.string(),
    styleTypeLabel: z.string(),
    styleTypePlaceholder: z.string(),
    aspectRatioLabel: z.string(),
    aspectRatioPlaceholder: z.string(),
  }),
  sesaOptions: z.object({
    ai: z.array(SesaOptionSchema),
    sty: z.array(SesaOptionSchema),
    fmt: z.array(SesaOptionSchema),
    typ: z.array(SesaOptionSchema),
    sbj: z.array(SesaOptionSchema),
  }),
  parameterOptions: z.object({
    styleType: z.array(SesaOptionSchema),
    aspectRatio: z.array(SesaOptionSchema),
  }),
});

export const PromptCreatorLocaleSchema = z.object({
  promptCreator: PromptCreatorContentSchema.optional(),
});
