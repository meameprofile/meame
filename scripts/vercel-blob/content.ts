// RUTA: scripts/vercel-blob/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Vercel Blob (valida un blob de muestra).
 * @version 1.2.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import path from "path";

import { list } from "@vercel/blob";
import { z } from "zod";

import { RrwebEventSchema } from "@/shared/lib/schemas/analytics/rrweb.schema";

import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";

async function diagnoseBlobContent() {
  const traceId = logger.startTrace("diagnoseBlobContent_v1.2");
  const groupId = logger.startGroup(
    "📦 Iniciando Guardián de Contenido de Vercel Blob..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "vercel-blob");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  const report: {
    reportMetadata: Record<string, string>;
    instructionsForAI: string[];
    validationStatus: "SUCCESS" | "FAILED";
    blobScanned: string;
    validationError: z.ZodError | null;
    summary: string;
  } = {
    reportMetadata: {
      script: "scripts/vercel-blob/content.ts",
      purpose: "Validación del contenido del blob más reciente.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Analiza 'validationStatus'. Un fallo indica que el contenido del blob más reciente es inválido.",
      "'blobScanned' muestra la URL del archivo analizado.",
      "Si hay un error, 'validationError' contendrá los detalles.",
    ],
    validationStatus: "FAILED",
    blobScanned: "N/A",
    validationError: null,
    summary: "",
  };

  try {
    loadEnvironment(["BLOB_READ_WRITE_TOKEN"]);
    const { blobs } = await list({
      prefix: "sessions/",
      limit: 1,
      mode: "expanded",
    });

    if (blobs.length === 0) {
      logger.warn("No se encontraron blobs para validar contenido.");
      report.validationStatus = "SUCCESS";
      report.summary =
        "No se encontraron blobs para validar, la auditoría se completó sin errores.";
      return;
    }

    const latestBlob = blobs[0];
    report.blobScanned = latestBlob.url;
    logger.info(`Analizando el contenido de: ${latestBlob.pathname}`);

    const response = await fetch(latestBlob.url);
    if (!response.ok)
      throw new Error(`Fallo al descargar el blob: ${response.statusText}`);

    const events = await response.json();
    const validation = z.array(RrwebEventSchema).safeParse(events);

    if (!validation.success) {
      report.validationError = validation.error;
      throw new Error(
        "El contenido del blob no coincide con el schema de rrweb."
      );
    }

    report.validationStatus = "SUCCESS";
    report.summary = `Contenido del blob más reciente ('${latestBlob.pathname}') es válido y contiene ${events.length} eventos.`;
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de contenido fallida: ${errorMessage}`;
    logger.error(report.summary, { traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(
      reportPath,
      JSON.stringify(
        { ...report, validationError: report.validationError?.flatten() },
        null,
        2
      )
    );
    logger.info(
      `Informe guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.validationStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseBlobContent();
