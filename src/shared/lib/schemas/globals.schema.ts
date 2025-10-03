// src/lib/schemas/globals.schema.ts
/**
 * @file globals.schema.ts
 * @description Esquema para el contenido global del sitio (metadata, etc.).
 * @version 1.0.0
 */
import { z } from "zod";

export const GlobalsLocaleSchema = z.object({
  metadata: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const GlobalsI18nSchema = z.object({
  "es-ES": GlobalsLocaleSchema,
  "pt-BR": GlobalsLocaleSchema,
  "en-US": GlobalsLocaleSchema,
  "it-IT": GlobalsLocaleSchema,
});
// src/lib/schemas/globals.schema.ts
