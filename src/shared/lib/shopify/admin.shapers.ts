// RUTA: src/shared/lib/shopify/admin.shapers.ts
/**
 * @file admin.shapers.ts
 * @description SSoT para la transformación de datos de la Admin API de Shopify.
 * @version 3.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import type { ShopifyAdminProduct } from "@/shared/lib/shopify/types/admin.types";

logger.trace("[AdminShaper] Módulo de transformación de datos v3.0 cargado.");

export const AdminProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  status: z.string(),
  price: z.string(),
  currency: z.string(),
  inventoryQuantity: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminProduct = z.infer<typeof AdminProductSchema>;

export function reshapeAdminProduct(
  shopifyProduct: ShopifyAdminProduct,
  traceId?: string
): AdminProduct {
  logger.trace(`[AdminShaper] Transformando producto: ${shopifyProduct.id}`, {
    traceId,
  });

  const firstVariant = shopifyProduct.variants.edges[0]?.node;

  if (!firstVariant) {
    logger.warn(
      `[Guardián] Producto ${shopifyProduct.id} sin variantes. Usando valores por defecto.`,
      { traceId }
    );
  }

  const transformed = {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    status: shopifyProduct.status,
    price: firstVariant?.price.amount || "0.00",
    currency: firstVariant?.price.currencyCode || "USD",
    inventoryQuantity: firstVariant?.inventoryQuantity || 0,
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
  };

  return AdminProductSchema.parse(transformed);
}

export function reshapeAdminProducts(
  products: ShopifyAdminProduct[],
  traceId?: string
): AdminProduct[] {
  logger.trace(
    `[AdminShaper] Transformando lote de ${products.length} productos.`,
    { traceId }
  );
  return products
    .map((product) => {
      try {
        return reshapeAdminProduct(product, traceId);
      } catch (error) {
        logger.error(
          `[Guardián] Fallo al transformar producto ${product.id}. Será omitido.`,
          { error, traceId }
        );
        return null;
      }
    })
    .filter((p): p is AdminProduct => p !== null);
}
