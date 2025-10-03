// RUTA: src/shared/lib/shopify/cart.ts
/**
 * @file cart.ts
 * @description SSoT para las mutaciones y consultas del carrito de Shopify.
 * @version 2.0.0 (Storefront Client Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { shopifyStorefrontFetch } from "./storefront-client"; // <-- USAR EL CLIENTE DE STOREFRONT
import { getCartQuery } from "./queries/cart";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { reshapeCart } from "./shapers";
import type {
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyAddToCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  Cart,
} from "./types";

export async function createCart(): Promise<Cart> {
  const res = await shopifyStorefrontFetch<ShopifyCreateCartOperation>({
    // <-- USAR shopifyStorefrontFetch
    query: createCartMutation,
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyStorefrontFetch<ShopifyAddToCartOperation>({
    // <-- USAR shopifyStorefrontFetch
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const res = await shopifyStorefrontFetch<ShopifyRemoveFromCartOperation>({
    // <-- USAR shopifyStorefrontFetch
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyStorefrontFetch<ShopifyUpdateCartOperation>({
    // <-- USAR shopifyStorefrontFetch
    query: editCartItemsMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getShopifyCart(
  cartId: string
): Promise<Cart | undefined> {
  const res = await shopifyStorefrontFetch<ShopifyCartOperation>({
    // <-- USAR shopifyStorefrontFetch
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  if (!res.body.data.cart) return undefined;
  return reshapeCart(res.body.data.cart);
}
