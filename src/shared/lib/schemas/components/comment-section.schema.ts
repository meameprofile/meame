// RUTA: src/shared/lib/schemas/components/comment-section.schema.ts
/**
 * @file comment-section.schema.ts
 * @description SSoT para el contrato de datos i18n del componente CommentSection.
 * @version 2.1.0 (Contract Synchronization)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CommentSectionContentSchema = z.object({
  title: z.string(),
  form: z.object({
    placeholder: z.string(),
    minCharactersError: z.string(),
    publishButton: z.string(),
    publishButtonLoading: z.string(),
    authRequiredMessage: z.string(),
    loginLinkText: z.string(),
    loginPrompt: z.string(),
    loginPromptSuffix: z.string(),
    loginLink: z.string(), // <-- PROPIEDAD RESTAURADA
  }),
  list: z.object({
    emptyState: z.string(),
  }),
  toast: z.object({
    success: z.string(),
    errorTitle: z.string(),
    authError: z.string(),
  }),
});

export type CommentSectionContent = z.infer<typeof CommentSectionContentSchema>;

export const CommentSectionLocaleSchema = z.object({
  commentSection: CommentSectionContentSchema.optional(),
});
