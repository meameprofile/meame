/**
 * @file content.ts
 * @description Guardián de Contenido para Shopify. Realiza un censo de los
 *              productos de la tienda a través de la Admin API.
 * @version 2.2.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";

import { shopifyAdminFetch } from "@/shared/lib/shopify/admin-client";
import {
  reshapeAdminProducts,
  type AdminProduct,
} from "@/shared/lib/shopify/admin.shapers";
import { getAdminProductsQuery } from "@/shared/lib/shopify/queries/admin-product";
import type { ShopifyAdminProductsOperation } from "@/shared/lib/shopify/types/admin.types";

import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";
import type { ScriptActionResult } from "../_utils/types";

interface Report {
  reportMetadata: { script: string; purpose: string; generatedAt: string };
  instructionsForAI: string[];
  censusStatus: "SUCCESS" | "FAILED";
  contentDetails: {
    products: AdminProduct[];
    hasNextPage: boolean;
    endCursor: string | null;
  };
  summary: string;
}

async function diagnoseShopifyContent(): Promise<ScriptActionResult<string>> {
  const traceId = logger.startTrace("diagnoseShopifyContent_v2.2");
  const groupId = logger.startGroup(
    "🛍️  Iniciando Censo de Contenido en Shopify..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "shopify");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: Report = {
    reportMetadata: {
      script: "scripts/shopify/content.ts",
      purpose: "Censo de productos desde la Shopify Admin API.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Este es un censo de los productos en la tienda de Shopify.",
      "Analiza 'contentDetails.products' para ver la lista de productos.",
      "Verifica que los productos esperados estén presentes y activos ('status').",
      "'hasNextPage' indica si hay más productos para paginar en una futura versión.",
    ],
    censusStatus: "FAILED",
    contentDetails: { products: [], hasNextPage: false, endCursor: null },
    summary: "",
  };

  try {
    loadEnvironment([
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_ADMIN_ACCESS_TOKEN",
      "SHOPIFY_API_VERSION",
    ]);

    const response = await shopifyAdminFetch<ShopifyAdminProductsOperation>({
      query: getAdminProductsQuery,
      variables: { first: 20 },
    });

    const productsData =
      response.body.data?.products?.edges.map((edge) => edge.node) || [];
    const pageInfo = response.body.data?.products?.pageInfo;

    const finalProducts = reshapeAdminProducts(productsData);

    report.contentDetails = {
      products: finalProducts,
      hasNextPage: pageInfo?.hasNextPage || false,
      endCursor: pageInfo?.endCursor || null,
    };

    if (finalProducts.length === 0) {
      report.censusStatus = "SUCCESS";
      report.summary =
        "Censo de Shopify completado. No se encontraron productos en la tienda.";
      logger.warn(report.summary);
    } else {
      report.censusStatus = "SUCCESS";
      report.summary = `Censo de Shopify completado. Se encontraron ${finalProducts.length} productos.`;
      logger.info("--- Censo de Productos de Shopify ---");
      console.table(
        finalProducts.map((p) => ({
          ID: p.id,
          Título: p.title,
          Handle: p.handle,
          Estado: p.status,
          Precio: `${p.price} ${p.currency}`,
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
      `Informe de censo guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.censusStatus === "FAILED") {
      process.exit(1);
    }
  }

  if (report.censusStatus === "SUCCESS") {
    return { success: true, data: report.summary };
  } else {
    return { success: false, error: report.summary };
  }
}

diagnoseShopifyContent();
