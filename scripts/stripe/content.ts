// pnpm tsx scripts/run-with-env.ts scripts/stripe/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Stripe. Realiza un censo de las
 *              transacciones (PaymentIntents) recientes y genera un informe.
 * @version 1.0.0 (Transactions Audit & AI-Consumable)
 * @author L.I.A. Legacy
 */
import Stripe from "stripe";
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

// --- SSoT de Contratos de Datos ---
interface Report {
  reportMetadata: {
    script: string;
    purpose: string;
    generatedAt: string;
  };
  instructionsForAI: string[];
  censusStatus: "SUCCESS" | "FAILED";
  contentDetails: {
    recent_payment_intents: unknown[];
  };
  summary: string;
}

async function diagnoseStripeContent(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseStripeContent_v1.0");
  scriptLogger.startGroup(
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
      "Este es un informe de censo de contenido para Stripe, enfocado en las transacciones recientes.",
      "Analiza 'contentDetails.recent_payment_intents' para ver la lista de los últimos 10 intentos de pago.",
      "Verifica los campos 'id', 'amount', 'currency', y especialmente 'status' ('succeeded', 'requires_payment_method', 'failed').",
      "Un alto número de estados 'failed' puede indicar un problema con la configuración de la pasarela de pago o reglas de fraude.",
      "Confirma que los metadatos ('metadata'), como el 'cartId', se están guardando correctamente en las transacciones.",
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
    scriptLogger.info("Consultando los últimos 10 PaymentIntents...");

    const paymentIntents = await stripe.paymentIntents.list({ limit: 10 });
    scriptLogger.traceEvent(
      traceId,
      "Datos de transacciones obtenidos de la API."
    );

    report.censusStatus = "SUCCESS";
    report.contentDetails.recent_payment_intents = paymentIntents.data;
    report.summary = `Censo de contenido completado. Se encontraron ${paymentIntents.data.length} transacciones recientes.`;

    scriptLogger.info("--- Transacciones Recientes (PaymentIntents) ---");
    console.table(
      paymentIntents.data.map((p) => ({
        ID: p.id,
        Monto: `${p.amount / 100} ${p.currency.toUpperCase()}`,
        Estado: p.status,
        Creación: new Date(p.created * 1000).toLocaleString(),
        "Cart ID": p.metadata.cartId || "N/A",
      }))
    );
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Censo de contenido fallido: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.censusStatus === "FAILED") process.exit(1);
  }

  if (report.censusStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseStripeContent();
