// src/lib/schemas/components/dev/dev-homepage-header.schema.ts
/**
 * @file dev-homepage-header.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente DevHomepageHeader.
 * @version 1.0.0
 * @author IA Ingeniera de Software Senior v2.0
 */
import { z } from "zod";

export const DevHomepageHeaderLocaleSchema = z.object({
  devHomepageHeader: z
    .object({
      homeLink: z.string(),
      aboutLink: z.string(),
      storeLink: z.string(),
      blogLink: z.string(),
      devMenuLabel: z.string(),
    })
    .optional(),
});

export const DevHomepageHeaderI18nSchema = z.object({
  "es-ES": DevHomepageHeaderLocaleSchema,
  "pt-BR": DevHomepageHeaderLocaleSchema,
  "en-US": DevHomepageHeaderLocaleSchema,
  "it-IT": DevHomepageHeaderLocaleSchema,
});
// src/lib/schemas/components/dev/dev-homepage-header.schema.ts
