// RUTA: src/shared/lib/commerce/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Capa de Acceso a Datos Soberana y Agregadora para E-commerce.
 *              v7.0.0 (Holistic Export & Shaper Consolidation): Refactorizado para
 *              re-exportar todos los módulos de forma holística y consumir el
 *              nuevo shaper consolidado.
 * @version 7.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import { getShopifyProducts, getShopifyProduct } from "@/shared/lib/shopify";

import { getCart as getCartData } from "./cart";
import { getLocalProducts } from "./catalog";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Re-exportamos todo desde el shaper consolidado.
export * from "./shapers";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

/**
 * @function getProducts
 * @description API pública para obtener TODOS los productos. Agrega datos de Shopify
 *              y del catálogo local de forma concurrente y resiliente.
 * @param {{ locale: Locale }} options - Opciones que incluyen el locale.
 * @returns {Promise<EnrichedProduct[]>} Una lista de productos enriquecidos y listos para la UI.
 */
export async function getProducts(options: {
  locale: Locale;
}): Promise<Product[]> {
  // El tipo de retorno es Product[], reshapeProducts se encargará de enriquecerlo si es necesario en el consumidor.
  const traceId = logger.startTrace("getProducts (Hybrid v7.0)");
  logger.info(
    `[Commerce DAL] Solicitando productos HÍBRIDOS para [${options.locale}]`
  );

  try {
    const [shopifyResult, localResult] = await Promise.allSettled([
      getShopifyProducts(),
      getLocalProducts(options.locale),
    ]);

    const shopifyProducts =
      shopifyResult.status === "fulfilled" ? shopifyResult.value : [];
    const localProducts =
      localResult.status === "fulfilled" ? localResult.value : [];

    if (shopifyResult.status === "rejected") {
      logger.error(
        "[Commerce DAL] Fallo al obtener productos de Shopify. Degradando elegantemente.",
        { error: shopifyResult.reason, traceId }
      );
    }

    logger.traceEvent(
      traceId,
      `Resultados de fuentes: Shopify: ${shopifyProducts.length}, Local: ${localProducts.length}`
    );

    const allProducts: Product[] = [...shopifyProducts, ...localProducts];
    return allProducts;
  } catch (error) {
    logger.error("Error inesperado en getProducts.", { error, traceId });
    return [];
  } finally {
    logger.endTrace(traceId);
  }
}

/**
 * @function getProductBySlug
 * @description API pública para obtener un único producto por su slug desde cualquier fuente.
 * @param {{ locale: Locale; slug: string }} options - Opciones de búsqueda.
 * @returns {Promise<Product | null>} El producto encontrado o null.
 */
export async function getProductBySlug(options: {
  locale: Locale;
  slug: string;
}): Promise<Product | null> {
  const traceId = logger.startTrace(`getProductBySlug:${options.slug}`);
  logger.info(
    `[Commerce DAL] Solicitando producto HÍBRIDO por slug: "${options.slug}"`
  );

  try {
    const shopifyProduct = await getShopifyProduct(options.slug).catch(
      () => null
    );
    if (shopifyProduct) {
      logger.traceEvent(traceId, "Producto encontrado en Shopify.");
      return shopifyProduct;
    }

    logger.traceEvent(
      traceId,
      "Producto no encontrado en Shopify. Buscando en catálogo local..."
    );
    const localProducts = await getLocalProducts(options.locale);
    const localProduct = localProducts.find((p) => p.slug === options.slug);

    if (localProduct) {
      logger.traceEvent(traceId, "Producto encontrado en catálogo local.");
      return localProduct;
    }

    logger.warn(
      `[Commerce DAL] Producto con slug "${options.slug}" no fue encontrado en ninguna fuente de datos.`,
      { traceId }
    );
    return null;
  } catch (error) {
    logger.error("Error inesperado en getProductBySlug.", { error, traceId });
    return null;
  } finally {
    logger.endTrace(traceId);
  }
}

export const getCart = getCartData;
