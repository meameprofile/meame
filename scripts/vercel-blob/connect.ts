// RUTA: scripts/vercel-blob/connect.ts
/**
 * @file connect.ts
 * @description Guardián de Conexión para Vercel Blob.
 * @version 1.0.0 (Production Ready)
 * @author RaZ Podestá - MetaShark Tech
 */
import { list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";

async function diagnoseBlobConnection() {
  const traceId = logger.startTrace("diagnoseBlobConnection_v1.0");
  logger.startGroup("🌍 Iniciando Guardián de Conexión a Vercel Blob...");

  const reportDir = path.resolve(process.cwd(), "reports", "vercel-blob");
  const reportPath = path.resolve(reportDir, "connect-diagnostics.json");

  const report = {
    reportMetadata: {
      script: "scripts/vercel-blob/connect.ts",
      purpose: "Diagnóstico de Conexión de Vercel Blob",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Verifica 'connectionStatus'. Un fallo indica un problema con 'BLOB_READ_WRITE_TOKEN'.",
      "El 'apiPingResult' confirma si el token tiene permisos para listar blobs.",
    ],
    connectionStatus: "FAILED",
    environmentValidation: {
      status: "MISSING",
      message: "Variable no verificada.",
    },
    apiPingResult: { status: "PENDING", message: "Prueba no ejecutada." },
    summary: "",
  };

  try {
    loadEnvironment(["BLOB_READ_WRITE_TOKEN"]);
    const token = process.env.BLOB_READ_WRITE_TOKEN!;
    if (!token) {
      throw new Error(
        "La variable de entorno BLOB_READ_WRITE_TOKEN no está definida."
      );
    }
    if (!token.startsWith("vercel_blob_rw_")) {
      report.environmentValidation = {
        status: "INVALID",
        message: "El formato de BLOB_READ_WRITE_TOKEN parece inválido.",
      };
      throw new Error(report.environmentValidation.message);
    }
    report.environmentValidation = {
      status: "OK",
      message: "Variable de entorno encontrada y con formato válido.",
    };
    logger.success(report.environmentValidation.message);

    logger.info("Realizando 'ping' a la API de Vercel Blob (list limit 1)...");
    await list({ limit: 1 });

    report.apiPingResult = {
      status: "OK",
      message: "La API de Vercel Blob respondió correctamente.",
    };
    report.connectionStatus = "SUCCESS";
    report.summary =
      "Diagnóstico exitoso. La conexión con Vercel Blob está activa y el token es válido.";
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Diagnóstico fallido: ${errorMessage}`;
    report.apiPingResult = { status: "FAILED", message: errorMessage };
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
    if (report.connectionStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseBlobConnection();
