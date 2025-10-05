// pnpm tsx scripts/run-with-env.ts scripts/shopify/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Shopify. Verifica variables de entorno
 *              y la conectividad con las APIs de Admin y Storefront.
 * @version 1.0.1 (Type-Safe & Linter-Compliant)
 * @author RaZ Podestá - MetaShark Tech
 */
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
  connectionStatus: "SUCCESS" | "PARTIAL_FAILURE" | "FAILED";
  environmentValidation: {
    variable: string;
    status: "OK" | "MISSING";
    message: string;
  }[];
  apiConnectionResults: {
    api: "Admin" | "Storefront";
    status: "OK" | "FAILED";
    message: string;
    details?: unknown;
  }[];
  summary: string;
}

async function diagnoseShopifyConnection(): Promise<
  ScriptActionResult<string>
> {
  const traceId = scriptLogger.startTrace("diagnoseShopifyConnection_v1.0.1");
  scriptLogger.startGroup("🛍️  Iniciando Guardián de Conexión a Shopify...");

  const reportDir = path.resolve(process.cwd(), "reports", "shopify");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/shopify/connect.ts",
      purpose: "Diagnóstico de Conexión de Shopify (Admin y Storefront APIs)",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un informe de diagnóstico de conexión para Shopify.",
      "Analiza 'connectionStatus' para el resultado general. 'PARTIAL_FAILURE' indica que una de las dos APIs falló.",
      "Revisa 'environmentValidation' para el estado de cada variable de entorno requerida.",
      "Revisa 'apiConnectionResults' para ver el resultado detallado de la conexión a cada API (Admin y Storefront).",
    ],
    connectionStatus: "FAILED",
    environmentValidation: [],
    apiConnectionResults: [],
    summary: "",
  };

  try {
    loadEnvironment();
    const requiredKeys = [
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_ADMIN_ACCESS_TOKEN",
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
      "SHOPIFY_API_VERSION",
    ];
    let allKeysValid = true;

    scriptLogger.info("Verificando variables de entorno...");
    for (const key of requiredKeys) {
      const value = process.env[key];
      if (value && value !== "" && !value.includes("tu-")) {
        report.environmentValidation.push({
          variable: key,
          status: "OK",
          message: `Variable '${key}' configurada.`,
        });
        scriptLogger.success(`Variable '${key}' encontrada.`);
      } else {
        allKeysValid = false;
        report.environmentValidation.push({
          variable: key,
          status: "MISSING",
          message: `ERROR: Variable '${key}' no definida o con valor por defecto en .env.local.`,
        });
        scriptLogger.error(
          `Variable '${key}' NO encontrada o con valor por defecto.`
        );
      }
    }

    if (!allKeysValid)
      throw new Error(
        "Una o más variables de entorno de Shopify faltan o son incorrectas."
      );
    scriptLogger.success(
      "Todas las variables de entorno requeridas están presentes y parecen válidas."
    );

    const domain = process.env.SHOPIFY_STORE_DOMAIN!;
    const apiVersion = process.env.SHOPIFY_API_VERSION!;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

    const pingQuery = `{ shop { name } }`;

    try {
      const adminUrl = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
      const adminResponse = await fetch(adminUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query: pingQuery }),
      });
      const adminBody = await adminResponse.json();
      if (!adminResponse.ok || adminBody.errors)
        throw new Error(JSON.stringify(adminBody.errors || "Respuesta no OK"));
      report.apiConnectionResults.push({
        api: "Admin",
        status: "OK",
        message: `Conexión exitosa a la tienda: ${adminBody.data.shop.name}`,
      });
      scriptLogger.success(
        `Conexión a la API de Admin exitosa. Tienda: ${adminBody.data.shop.name}`
      );
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Error desconocido";
      report.apiConnectionResults.push({
        api: "Admin",
        status: "FAILED",
        message: errorMsg,
      });
      scriptLogger.error(`Fallo la conexión con la API de Admin: ${errorMsg}`);
    }

    try {
      const storefrontUrl = `https://${domain}/api/${apiVersion}/graphql.json`;
      const storefrontResponse = await fetch(storefrontUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken,
        },
        body: JSON.stringify({ query: pingQuery }),
      });
      const storefrontBody = await storefrontResponse.json();
      if (!storefrontResponse.ok || storefrontBody.errors)
        throw new Error(
          JSON.stringify(storefrontBody.errors || "Respuesta no OK")
        );
      report.apiConnectionResults.push({
        api: "Storefront",
        status: "OK",
        message: "Conexión exitosa.",
      });
      scriptLogger.success("Conexión a la API de Storefront exitosa.");
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Error desconocido";
      report.apiConnectionResults.push({
        api: "Storefront",
        status: "FAILED",
        message: errorMsg,
      });
      scriptLogger.error(
        `Fallo la conexión con la API de Storefront: ${errorMsg}`
      );
    }

    const failures = report.apiConnectionResults.filter(
      (r) => r.status === "FAILED"
    ).length;
    if (failures === 0) {
      report.connectionStatus = "SUCCESS";
      report.summary =
        "Diagnóstico exitoso. Conexión a las APIs de Admin y Storefront está activa.";
      scriptLogger.success(report.summary);
    } else if (failures === report.apiConnectionResults.length) {
      throw new Error("Ambas conexiones de API de Shopify fallaron.");
    } else {
      report.connectionStatus = "PARTIAL_FAILURE";
      report.summary =
        "Diagnóstico parcial. Una de las conexiones de API de Shopify falló. Revisa los detalles.";
      scriptLogger.warn(report.summary);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
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

diagnoseShopifyConnection();
