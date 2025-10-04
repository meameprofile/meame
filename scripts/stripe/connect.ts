// pnpm tsx scripts/run-with-env.ts scripts/stripe/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Stripe. Verifica variables de entorno
 *              y la conectividad con la API, generando un informe de diagnóstico.
 * @version 1.0.2 (Definitive API Version Sync)
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
  connectionStatus: "SUCCESS" | "FAILED";
  environmentValidation: {
    variable: string;
    status: "OK" | "MISSING" | "INVALID";
    message: string;
  }[];
  apiConnectionResult: {
    status: "OK" | "FAILED";
    message: string;
    details?: unknown;
  };
  summary: string;
}

async function diagnoseStripeConnection(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseStripeConnection_v1.0.2");
  scriptLogger.startGroup("💳 Iniciando Guardián de Conexión a Stripe...");

  const reportDir = path.resolve(process.cwd(), "reports", "stripe");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/stripe/connect.ts",
      purpose: "Diagnóstico de Conexión de Stripe",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para Stripe.",
      "Analiza 'connectionStatus' para el resultado general.",
      "Revisa 'environmentValidation' para el estado de cada variable de entorno. Presta atención al formato de las claves ('sk_test_' o 'pk_test_').",
      "Revisa 'apiConnectionResult' para el resultado de la prueba de conexión real con la API.",
    ],
    connectionStatus: "FAILED",
    environmentValidation: [],
    apiConnectionResult: {
      status: "FAILED",
      message: "La prueba no se ha ejecutado.",
    },
    summary: "",
  };

  try {
    loadEnvironment();
    const requiredKeys = [
      "STRIPE_SECRET_KEY",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    ];
    let allKeysValid = true;

    for (const key of requiredKeys) {
      const value = process.env[key];
      let status: "OK" | "MISSING" | "INVALID" = "MISSING";
      let message = `ERROR: Variable '${key}' no definida en .env.local.`;

      if (value && value !== "" && !value.includes("TU_")) {
        if (key === "STRIPE_SECRET_KEY" && !value.startsWith("sk_")) {
          status = "INVALID";
          message = `ERROR: La '${key}' parece tener un formato inválido. Debe empezar con 'sk_'.`;
          allKeysValid = false;
        } else if (
          key === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" &&
          !value.startsWith("pk_")
        ) {
          status = "INVALID";
          message = `ERROR: La '${key}' parece tener un formato inválido. Debe empezar con 'pk_'.`;
          allKeysValid = false;
        } else {
          status = "OK";
          message = `Variable '${key}' configurada.`;
          scriptLogger.success(`Variable '${key}' encontrada.`);
        }
      } else {
        allKeysValid = false;
      }

      report.environmentValidation.push({ variable: key, status, message });
      if (status !== "OK") scriptLogger.error(message);
    }

    if (!allKeysValid)
      throw new Error(
        "Una o más variables de entorno de Stripe faltan o son inválidas."
      );

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    scriptLogger.info(
      "Intentando listar métodos de pago para verificar la clave secreta..."
    );

    const paymentMethods = await stripe.paymentMethods.list({ limit: 1 });

    report.connectionStatus = "SUCCESS";
    report.apiConnectionResult = {
      status: "OK",
      message: `Conexión exitosa. Se pudo obtener una lista de ${paymentMethods.data.length} método(s) de pago.`,
    };
    report.summary =
      "Diagnóstico exitoso. La conexión con la API de Stripe está activa y las credenciales son válidas.";
    scriptLogger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    report.apiConnectionResult = { status: "FAILED", message: errorMessage };
    scriptLogger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    scriptLogger.info(
      `Informe de diagnóstico guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.connectionStatus === "FAILED") process.exit(1);
  }

  if (report.connectionStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseStripeConnection();
