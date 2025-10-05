// pnpm tsx scripts/run-with-env.ts scripts/shopify/schema.ts
/**
 * @file schema.ts
 * @description Guardián de Esquema para Shopify. Audita las colecciones de la
 *              tienda y genera un informe de diagnóstico.
 * @version 1.0.1 (Type-Safe & Linter-Compliant)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";
import { shopifyAdminFetch } from "../../src/shared/lib/shopify/admin-client";

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
    collections: unknown[];
  };
  summary: string;
}

const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          productsCount
          sortOrder
        }
      }
    }
  }
`;

type ShopifyCollectionsOperation = {
  data: {
    collections: {
      edges: Array<{ node: unknown }>;
    };
  };
};

async function diagnoseShopifySchema(): Promise<ScriptActionResult<string>> {
  const traceId = scriptLogger.startTrace("diagnoseShopifySchema_v1.0.1");
  scriptLogger.startGroup("🔬 Auditando Esquema (Colecciones) de Shopify...");

  const reportDir = path.resolve(process.cwd(), "reports", "shopify");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/shopify/schema.ts",
      purpose: "Diagnóstico de Esquema (Colecciones) de Shopify",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este informe detalla las colecciones de productos configuradas en la tienda Shopify.",
      "Analiza 'schemaDetails.collections' para entender cómo están agrupados los productos.",
      "Cada colección incluye 'id', 'title', 'handle' (para URLs), y 'productsCount'.",
      "Verifica que las colecciones esperadas por la aplicación existan.",
    ],
    auditStatus: "FAILED",
    schemaDetails: { collections: [] },
    summary: "",
  };

  try {
    loadEnvironment([
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_ADMIN_ACCESS_TOKEN",
      "SHOPIFY_API_VERSION",
    ]);

    const response = await shopifyAdminFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
    });

    const collections = response.body.data.collections.edges.map(
      (edge) => edge.node
    );

    report.auditStatus = "SUCCESS";
    report.schemaDetails.collections = collections;
    report.summary = `Auditoría de esquema completada. Se encontraron ${collections.length} colecciones en la tienda.`;

    scriptLogger.info("--- Colecciones de la Tienda ---");
    console.table(collections);
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
    scriptLogger.endGroup();
    scriptLogger.endTrace(traceId);
    if (report.auditStatus === "FAILED") process.exit(1);
  }

  if (report.auditStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseShopifySchema();
