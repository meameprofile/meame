// RUTA: src/shared/lib/shopify/shapers.ts
/**
 * @file shapers.ts
 * @description SSoT para las funciones de transformación de datos de Shopify.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { Product } from "@/shared/lib/schemas/entities/product.schema";

import type { ShopifyProduct, ShopifyCart, Cart } from "./types";

const removeEdgesAndNodes = <T>(array: { edges: { node: T }[] }): T[] => {
  return array.edges.map((edge) => edge.node);
};

export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }
  return { ...cart, lines: removeEdgesAndNodes(cart.lines) };
};

export const reshapeShopifyProduct = (product: ShopifyProduct): Product => {
  const { variants, ...rest } = product;
  return {
    id: rest.id,
    name: rest.title,
    slug: rest.handle,
    description: rest.description,
    price: parseFloat(rest.priceRange.minVariantPrice.amount),
    currency: rest.priceRange.minVariantPrice.currencyCode,
    imageUrl: rest.featuredImage?.url ?? "/placeholder.jpg",
    isBestseller: rest.tags.includes("bestseller"),
    inventory: {
      total: 100,
      available: rest.availableForSale ? 100 : 0,
      reserved: 0,
    },
    logistics: { deliveryTime: "3-5 business days" },
    producerInfo: { name: "Global Fitwell", checkoutUrl: "" },
    categorization: {
      primary: product.tags[0] || "General",
      secondary: product.tags.slice(1),
    },
    targetProfile: {},
    rating: undefined,
    options: rest.options,
    variants: removeEdgesAndNodes(variants),
  };
};

export const reshapeShopifyProducts = (
  products: ShopifyProduct[]
): Product[] => {
  return products.map(reshapeShopifyProduct);
};
