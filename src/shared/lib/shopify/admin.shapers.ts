// RUTA: src/shared/lib/shopify/admin.shapers.ts
/**
 * @file admin.shapers.ts
 * @description SSoT para la transformación de datos de la Admin API de Shopify.
 *              Inyectado con observabilidad de élite y guardianes de resiliencia.
 * @version 2.0.0 (Observable & Resilient)
 *@author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { ShopifyAdminProduct } from "@/shared/lib/shopify/types/admin.types";

// --- [INYECCIÓN DE OBSERVABILIDAD] ---
logger.trace("[AdminShaper] Módulo de transformación de datos v2.0 cargado.");

// --- SSoT del Contrato de Datos de Salida ---
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

/**
 * @function reshapeAdminProduct
 * @description Transforma y valida un único objeto de producto de la Admin API.
 * @param {ShopifyAdminProduct} shopifyProduct - El objeto de producto crudo.
 * @returns {AdminProduct} El objeto de producto transformado y validado.
 * @throws {ZodError} Si el objeto transformado no cumple con el AdminProductSchema.
 */
export function reshapeAdminProduct(
  shopifyProduct: ShopifyAdminProduct
): AdminProduct {
  logger.trace(`[AdminShaper] Transformando producto: ${shopifyProduct.id}`);

  const firstVariant = shopifyProduct.variants.edges[0]?.node;

  // --- [GUARDIÁN DE RESILIENCIA] ---
  if (!firstVariant) {
    logger.warn(
      `[AdminShaper] Producto ${shopifyProduct.id} no tiene variantes. Se usarán valores por defecto para precio e inventario.`
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

  // El `parse` actúa como un guardián estricto. Si falla, lanzará una excepción
  // que será capturada por la Server Action que lo invoca.
  return AdminProductSchema.parse(transformed);
}

/**
 * @function reshapeAdminProducts
 * @description Aplica la transformación a un array de productos de forma segura.
 * @param {ShopifyAdminProduct[]} products - El array de productos de Shopify.
 * @returns {AdminProduct[]} El array de productos transformados y válidos.
 */
export function reshapeAdminProducts(
  products: ShopifyAdminProduct[]
): AdminProduct[] {
  logger.trace(
    `[AdminShaper] Transformando lote de ${products.length} productos.`
  );
  return products
    .map((product) => {
      try {
        return reshapeAdminProduct(product);
      } catch (error) {
        logger.error(
          `[AdminShaper] Fallo al transformar el producto ${product.id}. Será omitido del resultado final.`,
          { error }
        );
        return null; // Devuelve null si un producto individual falla la validación
      }
    })
    .filter((p): p is AdminProduct => p !== null); // Filtra los nulos para devolver un array limpio
}
