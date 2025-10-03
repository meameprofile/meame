// RUTA: src/shared/lib/schemas/pages/cogniread-editor.schema.ts
/**
 * @file cogniread-editor.schema.ts
 * @description SSoT para el contrato i18n del editor de CogniRead.
 * @version 2.1.0 (StudyDnaTab Contract Formalization)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CogniReadEditorContentSchema = z.object({
  pageHeader: z.object({
    createTitle: z.string(),
    createSubtitle: z.string(),
    editTitle: z.string(),
    editSubtitle: z.string(),
  }),
  tabs: z.object({
    dna: z.string(),
    content: z.string(),
    ecosystem: z.string(),
  }),
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  studyDnaTab: z.object({
    extractor: z.object({
      accordionTitle: z.string(),
      title: z.string(),
      description: z.string(),
      textAreaLabel: z.string(),
      textAreaPlaceholder: z.string(),
      modelSelectLabel: z.string(),
      extractButton: z.string(),
      extractButtonLoading: z.string(),
    }),
  }),
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  contentTab: z.object({
    titleLabel: z.string(),
    titlePlaceholder: z.string(),
    slugLabel: z.string(),
    slugPlaceholder: z.string(),
    summaryLabel: z.string(),
    summaryPlaceholder: z.string(),
    bodyLabel: z.string(),
    bodyPlaceholder: z.string(),
  }),
  ecosystemTab: z.object({
    heroImageTitle: z.string(),
    heroImageDescription: z.string(),
    noImageSelected: z.string(),
    selectFromBaviButton: z.string(),
    loadingBaviButton: z.string(),
    relatedPromptsTitle: z.string(),
    relatedPromptsDescription: z.string(),
  }),
  saveButton: z.string(),
  saveButtonLoading: z.string(),
  articleNotFoundError: z.string(),
});

export const CogniReadEditorLocaleSchema = z.object({
  cogniReadEditor: CogniReadEditorContentSchema.optional(),
});
