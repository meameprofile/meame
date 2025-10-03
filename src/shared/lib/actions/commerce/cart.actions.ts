// RUTA: src/shared/lib/actions/commerce/cart.actions.ts
/**
 * @file cart.actions.ts
 * @description Server Actions soberanas para la gestión del carrito de compras.
 * @version 4.0.0 (Sovereign DAL Consumption)
 * @author razstore (original), RaZ Podestá - MetaShark Tech (adaptación y nivelación)
 */
"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { logger } from "@/shared/lib/logging";
import { TAGS } from "@/shared/lib/utils/constants";
import {
  addToCart,
  createCart,
  removeFromCart,
  updateCart,
} from "@/shared/lib/shopify";
import { getCart } from "@/shared/lib/commerce/cart"; // <-- IMPORTACIÓN SOBERANA

export async function addItem(
  prevState: unknown,
  formData: FormData
): Promise<string | undefined> {
  const traceId = logger.startTrace("addItemAction_v4.0");
  const selectedVariantId = formData.get("variantId") as string | undefined;

  if (!selectedVariantId) {
    logger.warn("[addItemAction] Intento de añadir sin variantId.", {
      traceId,
    });
    logger.endTrace(traceId);
    return "cart.errors.addItemFailed";
  }

  try {
    let cartId = cookies().get("cartId")?.value;
    // Se consume la DAL soberana para obtener el carrito
    let cart = cartId ? await getCart() : undefined;

    if (!cart || !cartId) {
      logger.traceEvent(traceId, "Carrito no encontrado, creando uno nuevo...");
      try {
        cart = await createCart();
        cartId = cart.id;
        cookies().set("cartId", cartId);
        logger.success("[addItemAction] Nuevo carrito creado con éxito.", {
          cartId,
          traceId,
        });
      } catch (e) {
        logger.error("[addItemAction] Fallo crítico al crear el carrito.", {
          error: e,
          traceId,
        });
        logger.endTrace(traceId);
        return "cart.errors.createCartFailed";
      }
    }

    logger.traceEvent(traceId, "Añadiendo item a la API de Shopify...", {
      cartId,
    });
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);

    logger.success("[addItemAction] Item añadido al carrito con éxito.", {
      cartId,
      variantId: selectedVariantId,
      traceId,
    });
    logger.endTrace(traceId);
    return undefined;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error desconocido.";
    logger.error(
      "[addItemAction] Fallo inesperado al añadir item al carrito.",
      { error: errorMessage, traceId }
    );
    logger.endTrace(traceId);
    return "cart.errors.addItemFailed";
  }
}

export async function removeItem(
  prevState: unknown,
  lineId: string
): Promise<string | undefined> {
  const traceId = logger.startTrace("removeItemAction");
  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    logger.warn("[removeItemAction] Intento de eliminar item sin cartId.", {
      traceId,
    });
    logger.endTrace(traceId);
    return "cart.errors.removeItemFailed";
  }

  try {
    logger.traceEvent(traceId, "Eliminando línea de item del carrito...", {
      cartId,
      lineId,
    });
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
    logger.success("[removeItemAction] Item eliminado con éxito.", { traceId });
    logger.endTrace(traceId);
    return undefined;
  } catch (e) {
    logger.error("[removeItemAction] Fallo al eliminar item.", {
      error: e,
      cartId,
      traceId,
    });
    logger.endTrace(traceId);
    return "cart.errors.removeItemFailed";
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
): Promise<string | undefined> {
  const traceId = logger.startTrace("updateItemQuantityAction");
  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    logger.warn(
      "[updateItemQuantity] Intento de actualizar cantidad sin cartId.",
      { traceId }
    );
    logger.endTrace(traceId);
    return "cart.errors.updateItemFailed";
  }

  try {
    if (payload.quantity === 0) {
      logger.traceEvent(traceId, "Cantidad es 0, eliminando línea de item...", {
        cartId,
        lineId: payload.lineId,
      });
      await removeFromCart(cartId, [payload.lineId]);
    } else {
      logger.traceEvent(traceId, "Actualizando cantidad de línea de item...", {
        cartId,
        ...payload,
      });
      await updateCart(cartId, [
        {
          id: payload.lineId,
          merchandiseId: payload.variantId,
          quantity: payload.quantity,
        },
      ]);
    }
    revalidateTag(TAGS.cart);
    logger.success("[updateItemQuantity] Cantidad actualizada con éxito.", {
      traceId,
    });
    logger.endTrace(traceId);
    return undefined;
  } catch (e) {
    logger.error("[updateItemQuantity] Fallo al actualizar la cantidad.", {
      error: e,
      cartId,
      traceId,
    });
    logger.endTrace(traceId);
    return "cart.errors.updateItemFailed";
  }
}
