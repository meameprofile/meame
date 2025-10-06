// RUTA: src/shared/lib/schemas/components/product-showcase.schema.ts
/**
 * @file product-showcase.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente ProductShowcase.
 *              - v3.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 3.1.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().startsWith("/"),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductShowcaseContentSchema = z.object({
  title: z.string(),
  products: z.array(ProductSchema),
});

export const ProductShowcaseLocaleSchema = z.object({
  productShowcase: ProductShowcaseContentSchema.optional(),
});

export const ProductShowcaseI18nSchema = z.object({
  "es-ES": ProductShowcaseLocaleSchema,
  "en-US": ProductShowcaseLocaleSchema,
  "pt-BR": ProductShowcaseLocaleSchema,
  "it-IT": ProductShowcaseLocaleSchema,
});
