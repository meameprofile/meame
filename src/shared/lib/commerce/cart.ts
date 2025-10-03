// RUTA: src/shared/lib/commerce/cart.ts
/**
 * @file cart.ts
 * @description Capa de datos del lado del servidor para obtener el carrito.
 *              Actúa como un orquestador que consume la DAL de Shopify.
 * @version 3.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { cookies } from "next/headers";
import { getShopifyCart } from "@/shared/lib/shopify";
import type { Cart } from "@/shared/lib/shopify/types";
import { logger } from "@/shared/lib/logging";

/**
 * @function getCart
 * @description Obtiene el carrito del usuario actual basándose en la cookie 'cartId'.
 * @returns {Promise<Cart | undefined>} El objeto del carrito o undefined.
 */
export async function getCart(): Promise<Cart | undefined> {
  logger.trace("[Commerce/cart] Obteniendo carrito desde la cookie...");
  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    logger.trace("[Commerce/cart] No se encontró 'cartId' en las cookies.");
    return undefined;
  }

  logger.trace(
    `[Commerce/cart] Se encontró 'cartId': ${cartId}. Invocando la DAL de Shopify.`
  );
  return getShopifyCart(cartId);
}
