// RUTA: src/shared/lib/schemas/components/hero-news.schema.ts
/**
 * @file hero-news.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente HeroNews.
 *              - v2.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 2.1.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

/**
 * @const HeroNewsContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const HeroNewsContentSchema = z.object({
  mainTitle: z.string(),
  featuredArticle: z.object({
    tag: z.string(),
    title: z.string(),
    author: z.string(),
    readTime: z.number(),
  }),
});

/**
 * @const HeroNewsLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const HeroNewsLocaleSchema = z.object({
  heroNews: HeroNewsContentSchema.optional(),
});

export const HeroNewsI18nSchema = z.object({
  "es-ES": HeroNewsLocaleSchema,
  "en-US": HeroNewsLocaleSchema,
  "pt-BR": HeroNewsLocaleSchema,
  "it-IT": HeroNewsLocaleSchema,
});
