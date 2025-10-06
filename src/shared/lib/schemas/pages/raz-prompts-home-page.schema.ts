// RUTA: src/shared/lib/schemas/pages/raz-prompts-home-page.schema.ts
/**
 * @file raz-prompts-home-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la
 *              página principal de RaZPrompts, ahora simplificado.
 * @version 2.0.0 (Layout Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const RaZPromptsHomePageContentSchema = z.object({
  createPromptTab: z.string(),
  viewVaultTab: z.string(),
});

export const RaZPromptsHomePageLocaleSchema = z.object({
  razPromptsHomePage: RaZPromptsHomePageContentSchema.optional(),
});
