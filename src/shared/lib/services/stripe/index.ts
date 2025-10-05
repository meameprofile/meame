// RUTA: src/shared/lib/services/stripe/index.ts
/**
 * @file index.ts
 * @description Capa de Acceso a Datos (DAL) soberana para Stripe.
 *              v4.0.0 (Runtime Agnostic): Se elimina la directiva 'server-only'
 *              para permitir el consumo desde scripts de prueba E2E.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import Stripe from "stripe";
import { logger } from "@/shared/lib/logging";

// --- Guardia de Configuración de Nivel de Módulo ---
if (!process.env.STRIPE_SECRET_KEY) {
  const errorMsg =
    "Error Crítico de Arquitectura: La variable de entorno STRIPE_SECRET_KEY no está definida.";
  logger.error(errorMsg);
  throw new Error(errorMsg);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
  appInfo: {
    name: "Meame Elite Platform",
    version: "1.0.0",
  },
});

/**
 * @function createPaymentIntent
 * @description Crea una intención de pago en Stripe.
 * @param amount - El monto en la unidad más pequeña (ej. céntimos).
 * @param currency - El código de moneda (ej. 'eur').
 * @param metadata - Un objeto de metadatos para adjuntar al PaymentIntent.
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: Stripe.MetadataParam
): Promise<Stripe.PaymentIntent> {
  const traceId = logger.startTrace("stripe.createPaymentIntent");
  logger.info("[Stripe DAL] Creando PaymentIntent v4.0...", {
    amount,
    currency,
    metadata,
    traceId,
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata,
    });
    logger.success("[Stripe DAL] PaymentIntent creado con éxito.", {
      id: paymentIntent.id,
      traceId,
    });
    return paymentIntent;
  } catch (error) {
    logger.error("[Stripe DAL] Fallo al crear el PaymentIntent.", {
      error,
      traceId,
    });
    throw new Error("No se pudo iniciar la sesión de pago con Stripe.");
  } finally {
    logger.endTrace(traceId);
  }
}
