// RUTA: src/shared/lib/commerce/shapers.ts
/**
 * @file shapers.ts
 * @description SSoT para las funciones de transformación (shapers) de entidades de comercio.
 *              Forjado con observabilidad de élite, guardianes de resiliencia y seguridad
 *              de tipos absoluta para un procesamiento de datos a prueba de fallos.
 * @version 4.0.0 (Holistic Consolidation & Type Purity)
 *@author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { logger } from "@/shared/lib/logging";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import type {
  ShopifyProduct,
  ShopifyCart,
  Cart,
  CartItem as ShopifyCartItem,
} from "@/shared/lib/shopify/types";
import type { CartItem as StoreCartItem } from "@/shared/lib/stores/useCartStore";

// --- [INICIO DE CONSOLIDACIÓN ARQUITECTÓNICA] ---

/**
 * @interface EnrichedProduct
 * @description Extiende la entidad Product con metadatos útiles para la UI, como la ruta.
 */
export interface EnrichedProduct extends Product {
  path: string;
}

/**
 * @function reshapeProduct
 * @description Transforma un objeto Product crudo en un EnrichedProduct.
 */
export function reshapeProduct(product: Product): EnrichedProduct {
  logger.trace(`[Shaper] Remodelando producto: ${product.id}`);
  return {
    ...product,
    path: `/store/${product.slug}`,
  };
}

/**
 * @function reshapeProducts
 * @description Aplica el shaper a un array de productos.
 */
export function reshapeProducts(products: Product[]): EnrichedProduct[] {
  return products.map(reshapeProduct);
}

// --- [FIN DE CONSOLIDACIÓN ARQUITECTÓNICA] ---

/**
 * @function reshapeCart
 * @description Transforma un objeto ShopifyCart crudo en un objeto Cart soberano.
 * @param {ShopifyCart} cart - El objeto de carrito de Shopify.
 * @returns {Cart} El objeto de carrito transformado.
 */
export const reshapeCart = (cart: ShopifyCart): Cart => {
  logger.trace(`[Shaper] Transformando ShopifyCart ID: ${cart.id}`);
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }
  return {
    ...cart,
    lines: cart.lines.edges.map((edge) => edge.node),
  };
};

/**
 * @function reshapeShopifyProduct
 * @description Transforma un único ShopifyProduct en la entidad Product soberana de la aplicación.
 * @param {ShopifyProduct} product - El producto crudo de Shopify.
 * @returns {Product} La entidad Product transformada.
 */
export const reshapeShopifyProduct = (product: ShopifyProduct): Product => {
  logger.trace(`[Shaper] Transformando ShopifyProduct ID: ${product.id}`);

  return {
    id: product.id,
    name: product.title,
    slug: product.handle,
    description: product.description,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    currency: product.priceRange.minVariantPrice.currencyCode,
    imageUrl: product.featuredImage?.url ?? "/img/placeholder-product.png",
    isBestseller: product.tags.includes("bestseller"),
    inventory: {
      total: 100, // Placeholder
      available: product.availableForSale ? 100 : 0,
      reserved: 0,
    },
    logistics: { deliveryTime: "3-5 business days" },
    producerInfo: { name: "Global Fitwell", checkoutUrl: "" },
    categorization: {
      primary: product.tags[0] || "General",
      secondary: product.tags.slice(1),
    },
    targetProfile: {}, // Se añade un objeto vacío para cumplir el contrato
    rating: undefined,
    options: product.options,
    variants: product.variants.edges.map((edge) => edge.node),
  };
};

/**
 * @function reshapeShopifyProducts
 * @description Transforma un array de ShopifyProduct en un array de Product.
 * @param {ShopifyProduct[]} products - El array de productos crudos.
 * @returns {Product[]} El array de productos transformados.
 */
export const reshapeShopifyProducts = (
  products: ShopifyProduct[]
): Product[] => {
  return products.map(reshapeShopifyProduct);
};

/**
 * @function reshapeCartForStore
 * @description Transforma un objeto Cart de la API de Shopify en un array de CartItem
 *              listo para ser consumido por el store de Zustand.
 * @param {Cart | undefined} cart - El objeto de carrito crudo de Shopify.
 * @returns {StoreCartItem[]} Un array de items de carrito enriquecidos.
 */
export function reshapeCartForStore(cart: Cart | undefined): StoreCartItem[] {
  const traceId = logger.startTrace("reshapeCartForStore_v4.0");

  if (!cart || !cart.lines || cart.lines.length === 0) {
    logger.trace(
      "[Shaper] El carrito está vacío o no existe. Devolviendo array vacío.",
      { traceId }
    );
    logger.endTrace(traceId);
    return [];
  }

  logger.info(
    `[Shaper] Transformando carrito ${cart.id} con ${cart.lines.length} líneas para el store.`,
    { traceId }
  );

  const reshapedItems = cart.lines
    .map((line: ShopifyCartItem): StoreCartItem | null => {
      const product = line.merchandise.product;
      if (!product || !product.id) {
        logger.warn(
          `[Shaper] Línea de carrito ID ${line.id} omitida por datos de producto inválidos.`,
          { traceId, line }
        );
        return null;
      }

      const pricePerItem =
        line.quantity > 0
          ? parseFloat(line.cost.totalAmount.amount) / line.quantity
          : 0;

      return {
        id: product.id,
        name: product.title,
        slug: product.handle,
        description: product.description,
        price: pricePerItem,
        currency: line.cost.totalAmount.currencyCode,
        imageUrl: product.featuredImage?.url ?? "/img/placeholder-product.png",
        isBestseller: product.tags.includes("bestseller"),
        inventory: {
          total: 100,
          available: product.availableForSale ? 100 : 0,
          reserved: 0,
        },
        logistics: { deliveryTime: "3-5 business days" },
        producerInfo: { name: "Global Fitwell", checkoutUrl: "" },
        categorization: {
          primary: product.tags[0] || "General",
          secondary: product.tags.slice(1),
        },
        // --- [INICIO DE CORRECCIÓN DE CONTRATO Y 'ANY'] ---
        // Se añade explícitamente la propiedad 'targetProfile' con un objeto vacío
        // para cumplir con el contrato de la entidad 'Product', eliminando la necesidad del 'any' cast.
        targetProfile: {},
        // --- [FIN DE CORRECCIÓN DE CONTRATO Y 'ANY'] ---
        options: product.options,
        variants: product.variants.edges.map((edge) => edge.node),
        quantity: line.quantity,
      };
    })
    .filter((item): item is StoreCartItem => item !== null);

  logger.success(
    `[Shaper] Transformación completada. Se procesaron ${reshapedItems.length} items válidos.`,
    { traceId }
  );
  logger.endTrace(traceId);
  return reshapedItems;
}
