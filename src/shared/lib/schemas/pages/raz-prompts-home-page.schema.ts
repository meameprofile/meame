// RUTA: lib/schemas/pages/raz-prompts-home-page.schema.ts (Archivo Nuevo)
/**
 * @file raz-prompts-home-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la
 *              página principal de RaZPrompts.
 * @version 1.0.0 (Elite & Atomic)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const RaZPromptsHomePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  createPromptTab: z.string(),
  viewVaultTab: z.string(),
});

export const RaZPromptsHomePageLocaleSchema = z.object({
  razPromptsHomePage: RaZPromptsHomePageContentSchema.optional(),
});
