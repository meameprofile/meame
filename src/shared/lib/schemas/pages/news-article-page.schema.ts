// RUTA: src/shared/lib/schemas/pages/news-article-page.schema.ts
/**
 * @file news-article-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de una
 *              página de artículo de noticias individual.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { ContentBlocksSchema } from "@/shared/lib/schemas/components/content-block.schema";

/**
 * @const NewsArticlePageContentSchema
 * @description Valida la estructura completa del contenido de un artículo.
 */
export const NewsArticlePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  author: z.string(),
  publishedDate: z.string(),
  readTime: z.number().positive(),
  category: z.string(),
  featuredImageUrl: z.string().startsWith("/"),
  featuredImageAlt: z.string(),
  content: ContentBlocksSchema,
});

/**
 * @const NewsArticlePageLocaleSchema
 * @description Valida el objeto de un artículo específico dentro de un archivo i18n.
 *              La clave será el slug del artículo.
 */
export const NewsArticlePageLocaleSchema = z.record(
  NewsArticlePageContentSchema
);

/**
 * @type NewsArticlePageContent
 * @description Infiere el tipo de TypeScript para el contenido de un artículo.
 */
export type NewsArticlePageContent = z.infer<
  typeof NewsArticlePageContentSchema
>;
// RUTA: src/shared/lib/schemas/pages/news-article-page.schema.ts
