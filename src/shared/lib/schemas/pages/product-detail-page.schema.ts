// RUTA: src/shared/lib/schemas/pages/product-detail-page.schema.ts
/**
 * @file product-detail-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de una
 *              página de detalle de producto, ahora con contenido estructurado.
 * @version 3.0.0 (Structured Content Blocks)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { ProductSchema } from "@/shared/lib/schemas/entities/product.schema";
import { ShareButtonContentSchema } from "../components/share-button.schema";
import { ContentBlocksSchema } from "../components/content-block.schema";

export const ProductDetailPageContentSchema = z.object({
  productData: ProductSchema,
  galleryImages: z.array(
    z.object({
      src: z.string().startsWith("/"),
      alt: z.string(),
    })
  ),
  description: ContentBlocksSchema,
  addToCartButton: z.string(),
  quantityLabel: z.string(),
  relatedProductsTitle: z.string(),
  stockStatus: z.object({
    available: z.string().includes("{{count}}"),
    unavailable: z.string(),
  }),
  shareButton: ShareButtonContentSchema,
});

export const ProductDetailPageLocaleSchema = z.record(
  ProductDetailPageContentSchema
);
