// RUTA: scripts/stripe/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Stripe. Realiza un censo de las
 *              transacciones (PaymentIntents) recientes y genera un informe.
 * @version 2.1.0 (Definitive Return Contract)
 * @author RaZ Podestá - MetaShark Tech
 */
import Stripe from "stripe";
import { promises as fs } from "fs";
import path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

interface Report {
  reportMetadata: { script: string; purpose: string; generatedAt: string };
  instructionsForAI: string[];
  censusStatus: "SUCCESS" | "FAILED";
  contentDetails: { recent_payment_intents: Stripe.PaymentIntent[] };
  summary: string;
}

async function diagnoseStripeContent(): Promise<ScriptActionResult<string>> {
  const traceId = logger.startTrace("diagnoseStripeContent_v2.1");
  const groupId = logger.startGroup(
    "📊 Realizando censo de contenido (Transacciones) en Stripe..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "stripe");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/stripe/content.ts",
      purpose: "Diagnóstico de Contenido (PaymentIntents Recientes) de Stripe",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un censo de contenido para Stripe, enfocado en transacciones recientes.",
      "Analiza 'contentDetails.recent_payment_intents' para ver los últimos 10 intentos de pago.",
      "Verifica 'status' ('succeeded', 'failed') y los metadatos ('metadata') para asegurar la integridad de los datos.",
    ],
    censusStatus: "FAILED",
    contentDetails: { recent_payment_intents: [] },
    summary: "",
  };

  try {
    loadEnvironment(["STRIPE_SECRET_KEY"]);
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeApiKey)
      throw new Error(
        "La variable de entorno STRIPE_SECRET_KEY no está definida."
      );

    const stripe = new Stripe(stripeApiKey, { apiVersion: "2025-08-27.basil" });
    logger.info("Consultando los últimos 10 PaymentIntents...");

    const paymentIntents = await stripe.paymentIntents.list({ limit: 10 });

    if (paymentIntents.data.length === 0) {
      report.censusStatus = "SUCCESS";
      report.summary =
        "Censo de Stripe completado. No se encontraron transacciones recientes.";
      logger.warn(report.summary);
    } else {
      report.censusStatus = "SUCCESS";
      report.contentDetails.recent_payment_intents = paymentIntents.data;
      report.summary = `Censo de contenido completado. Se encontraron ${paymentIntents.data.length} transacciones recientes.`;

      logger.info("--- Transacciones Recientes (PaymentIntents) ---");
      console.table(
        paymentIntents.data.map((p) => ({
          ID: p.id,
          Monto: `${(p.amount / 100).toFixed(2)} ${p.currency.toUpperCase()}`,
          Estado: p.status,
          Creación: new Date(p.created * 1000).toLocaleString(),
          "Cart ID": p.metadata.cartId || "N/A",
        }))
      );
      logger.success(report.summary);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Censo de contenido fallido: ${errorMessage}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.censusStatus === "FAILED") process.exit(1);
  }

  if (report.censusStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseStripeContent();
