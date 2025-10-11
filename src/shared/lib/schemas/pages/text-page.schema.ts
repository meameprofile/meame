// src/shared/lib/schemas/pages/text-page.schema.ts
/**
 * @file text-page.schema.ts
 * @description Schema genérico para páginas de contenido estático, ahora basado en bloques de contenido.
 * @version 5.0.0 (Structured Content Blocks)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { ContentBlocksSchema } from "@/shared/lib/schemas/components/content-block.schema";

export const TextPageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  content: ContentBlocksSchema, // <-- CORRECCIÓN: Se exige un array de bloques.
});

export const TextPageLocaleSchema = z.object({
  aboutPage: TextPageContentSchema.optional(),
  privacyPage: TextPageContentSchema.optional(),
  termsPage: TextPageContentSchema.optional(),
  cookiesPage: TextPageContentSchema.optional(),
});
