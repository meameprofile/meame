// RUTA: scripts/testing/test-stripe-flow.ts
/**
 * @file test-stripe-flow.ts
 * @description Guardián de Integridad del Flujo de Pago E2E, ahora arquitectónicamente puro.
 * @version 3.0.0 (Architecturally Pure & Functional)
 * @author L.I.A. Legacy
 */
import Stripe from "stripe";
import { createScriptClient } from "../supabase/script-client";
import { scriptLogger, type ScriptActionResult } from "../_utils/script-logger";

const TEST_AMOUNT_CENTS = 1099; // €10.99

async function testStripeE2EFlow(): Promise<
  ScriptActionResult<{ orderId: string }>
> {
  const traceId = scriptLogger.startTrace("testStripeE2EFlow_v3.0");
  scriptLogger.startGroup(
    "[Stripe E2E Test] Iniciando guardián de integridad v3.0..."
  );

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey === "TU_STRIPE_SECRET_KEY_AQUI") {
    const errorMsg =
      "La variable de entorno STRIPE_SECRET_KEY no está configurada.";
    scriptLogger.error(errorMsg, { traceId });
    return { success: false, error: errorMsg };
  }

  const stripe = new Stripe(stripeSecretKey);
  const supabase = createScriptClient();

  try {
    scriptLogger.traceEvent(
      traceId,
      "Paso 1: Creando PaymentIntent de prueba..."
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: TEST_AMOUNT_CENTS,
      currency: "eur",
      metadata: { testCartId: `cart_${Date.now()}` },
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });
    scriptLogger.success(`PaymentIntent creado: ${paymentIntent.id}`);

    scriptLogger.traceEvent(
      traceId,
      "Paso 2: Confirmando pago para disparar el webhook..."
    );
    const confirmedIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: "pm_card_visa" }
    );
    if (confirmedIntent.status !== "succeeded") {
      throw new Error(
        `La confirmación del pago falló con estado: ${confirmedIntent.status}`
      );
    }
    scriptLogger.success(
      "Pago confirmado. Webhook 'payment_intent.succeeded' enviado."
    );

    scriptLogger.traceEvent(
      traceId,
      "Paso 3: Esperando 5 segundos para el procesamiento del webhook..."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));

    scriptLogger.traceEvent(
      traceId,
      "Paso 4: Verificando la creación de la orden en Supabase..."
    );
    const { data: order, error } = await supabase
      .from("commerce_orders")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntent.id)
      .single();

    if (error)
      throw new Error(`Error al consultar Supabase: ${error.message}.`);
    if (!order)
      throw new Error(
        "¡FALLO DE VERIFICACIÓN! La orden no fue encontrada en la base de datos."
      );

    scriptLogger.success(
      `[VERIFICACIÓN EXITOSA] Orden encontrada en DB con ID: ${order.id}`
    );
    return { success: true, data: { orderId: order.id } };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido.";
    scriptLogger.error("El flujo de prueba falló:", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
  }
}

export default testStripeE2EFlow;
