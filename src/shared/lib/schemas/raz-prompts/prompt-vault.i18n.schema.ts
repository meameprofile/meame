// lib/schemas/raz-prompts/prompt-vault.i18n.schema.ts
/**
 * @file prompt-vault.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente PromptVault.
 * @version 2.0.0 (Full UI Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const PromptVaultContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  searchPlaceholder: z.string(),
  searchButton: z.string(),
  filterByAILabel: z.string(),
  allAIsOption: z.string(),
  loadingPrompts: z.string(),
  noPromptsFound: z.string(),
  previousPageButton: z.string(),
  nextPageButton: z.string(),
  pageInfo: z.string(),
  viewDetailsButton: z.string(), // <-- NUEVO
  noImageYet: z.string(), // <-- NUEVO
});

export const PromptVaultLocaleSchema = z.object({
  promptVault: PromptVaultContentSchema.optional(),
});
// lib/schemas/raz-prompts/prompt-vault.i18n.schema.ts
