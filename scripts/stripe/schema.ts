// RUTA: scripts/stripe/schema.ts
/**
 * @file schema.ts
 * @description Guardián de Esquema para Stripe. Audita los productos y precios
 *              configurados en la cuenta y genera un informe de diagnóstico.
 * @version 1.0.2 (Holistic & Type-Safe Delivery)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import Stripe from "stripe";

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
  auditStatus: "SUCCESS" | "FAILED";
  schemaDetails: {
    products: unknown[];
    prices: unknown[];
  };
  summary: string;
}

async function diagnoseStripeSchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseStripeSchema_v1.0.2");
  const groupId = scriptLogger.startGroup(
    "🔬 Auditando Esquema (Productos y Precios) de Stripe..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "stripe");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/stripe/schema.ts",
      purpose: "Diagnóstico de Esquema (Productos y Precios) de Stripe",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de esquema para Stripe, enfocado en los productos y precios.",
      "Analiza 'schemaDetails.products' para ver los productos definidos en el catálogo de Stripe.",
      "Analiza 'schemaDetails.prices' para ver los precios asociados a esos productos, incluyendo moneda, monto y tipo (único, recurrente).",
      "Verifica que los IDs de precios que la aplicación espera utilizar existan en esta lista.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { products: [], prices: [] },
    summary: "",
  };

  try {
    loadEnvironment(["STRIPE_SECRET_KEY"]);
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeApiKey) {
      throw new Error(
        "La variable de entorno STRIPE_SECRET_KEY no está definida."
      );
    }

    const stripe = new Stripe(stripeApiKey, { apiVersion: "2025-08-27.basil" });
    scriptLogger.info("Consultando los últimos 10 productos y precios...");

    const [products, prices] = await Promise.all([
      stripe.products.list({ limit: 10 }),
      stripe.prices.list({ limit: 10 }),
    ]);
    scriptLogger.traceEvent(
      traceId,
      "Datos de productos y precios obtenidos de la API."
    );

    report.auditStatus = "SUCCESS";
    report.schemaDetails.products = products.data;
    report.schemaDetails.prices = prices.data;
    report.summary = `Auditoría de esquema completada. Se encontraron ${products.data.length} productos y ${prices.data.length} precios recientes.`;

    scriptLogger.info("--- Productos Recientes ---");
    console.table(
      products.data.map((p) => ({
        id: p.id,
        name: p.name,
        active: p.active,
        created: new Date(p.created * 1000).toLocaleDateString(),
      }))
    );
    scriptLogger.info("--- Precios Recientes ---");
    console.table(
      prices.data.map((p) => ({
        id: p.id,
        product: p.product,
        active: p.active,
        currency: p.currency,
        unit_amount: p.unit_amount,
      }))
    );
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup(groupId);
    scriptLogger.endTrace(traceId);
    if (report.auditStatus === "FAILED") {
      process.exit(1);
    }
  }

  if (report.auditStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseStripeSchema();
