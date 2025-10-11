// RUTA: src/shared/lib/actions/commerce/checkout.action.ts
/**
 * @file checkout.action.ts
 * @description Server Action soberana que orquesta el proceso de checkout.
 *              Actúa como un guardián de la lógica de negocio, obteniendo
 *              datos del carrito, calculando el total y creando una intención
 *              de pago segura en Stripe.
 * @version 3.0.0 (Elite Leveling & i18n Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { getCart } from "@/shared/lib/commerce/cart";
import { logger } from "@/shared/lib/logging";
import { createPaymentIntent } from "@/shared/lib/services/stripe";
import type { ActionResult } from "@/shared/lib/types/actions.types";

interface CheckoutSessionPayload {
  clientSecret: string | null;
}

export async function createCheckoutSessionAction(): Promise<
  ActionResult<CheckoutSessionPayload>
> {
  const traceId = logger.startTrace("createCheckoutSessionAction_v3.0");
  logger.info("[Checkout Action] Iniciando sesión de checkout v3.0...", {
    traceId,
  });

  const cart = await getCart();

  if (!cart || cart.lines.length === 0) {
    logger.warn("[Checkout Action] Intento de checkout con carrito vacío.", {
      traceId,
    });
    // Pilar I: Devolver clave de i18n
    return { success: false, error: "cart.errors.emptyCart" };
  }

  // Pilar VI: Lógica de negocio crítica ejecutada en el servidor
  const amountInCents = Math.round(
    parseFloat(cart.cost.totalAmount.amount) * 100
  );
  const currency = cart.cost.totalAmount.currencyCode;

  // Pilar III: Observabilidad mejorada
  logger.traceEvent(traceId, "Datos del carrito validados y procesados.", {
    cartId: cart.id,
    itemCount: cart.lines.length,
    amount: amountInCents,
    currency,
  });

  try {
    const metadata = { cartId: cart.id };
    logger.traceEvent(
      traceId,
      "Inyectando metadatos en PaymentIntent.",
      metadata
    );

    const paymentIntent = await createPaymentIntent(
      amountInCents,
      currency,
      metadata
    );

    logger.success("[Checkout Action] PaymentIntent creado con metadatos.", {
      paymentIntentId: paymentIntent.id,
      traceId,
    });
    return {
      success: true,
      data: { clientSecret: paymentIntent.client_secret },
    };
  } catch (error) {
    logger.error("[Checkout Action] Fallo al crear PaymentIntent.", {
      error,
      traceId,
    });
    // Pilar I: Devolver clave de i18n
    return { success: false, error: "cart.errors.checkoutFailed" };
  } finally {
    logger.endTrace(traceId);
  }
}
