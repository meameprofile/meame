// RUTA: src/app/api/webhooks/stripe/route.ts
/**
 * @file route.ts
 * @description Endpoint de API de élite para webhooks de Stripe.
 *              v7.0.0 (Build Resilience): Refactorizado con inicialización
 *              diferida para ser resiliente a la ausencia de variables de
 *              entorno durante el proceso de build, resolviendo un fallo crítico.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import Stripe from "stripe";
import { logger } from "@/shared/lib/logging";
import { sendOrderConfirmationEmailAction } from "@/shared/lib/actions/notifications/send-order-confirmation.action";
import { getShopifyCart } from "@/shared/lib/shopify";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  OrderSchema,
  type Order,
  type OrderItem,
} from "@/shared/lib/schemas/entities/order.schema";

export async function POST(req: Request) {
  const traceId = logger.startTrace("stripeWebhook_v7.0_Resilient");
  logger.info("[Stripe Webhook v7.0] Evento entrante recibido...", { traceId });

  // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA] ---
  // La inicialización y validación ocurren en tiempo de ejecución, no en tiempo de build.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey || !webhookSecret) {
    logger.error(
      "[Stripe Webhook] Claves de Stripe no configuradas en el entorno.",
      { traceId }
    );
    return new NextResponse("Configuración del servidor incompleta.", {
      status: 500,
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  // --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA] ---

  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = `Falló la verificación de la firma: ${(err as Error).message}`;
    return new NextResponse(errorMessage, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const cartId = paymentIntent.metadata.cartId;
        const userId = paymentIntent.metadata.userId || undefined;

        if (!cartId)
          throw new Error(
            `PaymentIntent ${paymentIntent.id} no tiene un cartId.`
          );
        const cart = await getShopifyCart(cartId);
        if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado.`);

        const now = new Date().toISOString();
        const orderItems: OrderItem[] = cart.lines.map((line) => ({
          productId: line.merchandise.product.id,
          variantId: line.merchandise.id,
          name: line.merchandise.product.title,
          quantity: line.quantity,
          price: parseFloat(line.cost.totalAmount.amount),
        }));

        const orderDocumentData: Order = {
          orderId: createId(),
          stripePaymentIntentId: paymentIntent.id,
          userId: userId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: "succeeded",
          customerEmail: paymentIntent.receipt_email!,
          items: orderItems,
          createdAt: now,
          updatedAt: now,
        };

        const validatedOrder = OrderSchema.parse(orderDocumentData);
        const supabase = createServerClient();
        const { error: insertError } = await supabase
          .from("commerce_orders")
          .insert({
            id: validatedOrder.orderId,
            stripe_payment_intent_id: validatedOrder.stripePaymentIntentId,
            user_id: validatedOrder.userId,
            amount: validatedOrder.amount,
            currency: validatedOrder.currency,
            status: validatedOrder.status,
            customer_email: validatedOrder.customerEmail,
            items: validatedOrder.items,
            created_at: validatedOrder.createdAt,
            updated_at: validatedOrder.updatedAt,
          });
        if (insertError) throw new Error(insertError.message);
        await sendOrderConfirmationEmailAction({
          to: validatedOrder.customerEmail,
          orderId: validatedOrder.orderId,
          totalAmount: new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: validatedOrder.currency,
          }).format(validatedOrder.amount),
          items: validatedOrder.items,
        });
        break;
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Stripe Webhook] Error inesperado al procesar el evento.", {
      eventType: event.type,
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Error interno del servidor.", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
