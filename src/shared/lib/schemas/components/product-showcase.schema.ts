// lib/schemas/components/product-showcase.schema.ts
/**
 * @file product-showcase.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente ProductShowcase.
 *              - v3.0.0 (Type Safety): Exporta el tipo 'Product' para garantizar
 *                la seguridad de tipos en el componente consumidor.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [ProductShowcase] v3.0");

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().startsWith("/"),
});

// --- [INICIO] REFACTORIZACIÓN ARQUITECTÓNICA ---
export type Product = z.infer<typeof ProductSchema>;
// --- [FIN] REFACTORIZACIÓN ARQUITECTÓNICA ---

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
// lib/schemas/components/product-showcase.schema.ts
