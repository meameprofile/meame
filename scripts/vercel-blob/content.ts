// RUTA: scripts/vercel-blob/content.ts
/**
 * @file content.ts
 * @description Guardián de Contenido para Vercel Blob (valida un blob de muestra).
 *              v1.1.0 (Type Safety & Elite Compliance): Se erradica el uso de 'any'
 *              y se alinea con los 8 Pilares de Calidad.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";
import { RrwebEventSchema } from "@/shared/lib/schemas/analytics/rrweb.schema";

async function diagnoseBlobContent() {
  const traceId = logger.startTrace("diagnoseBlobContent_v1.1");
  logger.startGroup("📦 Iniciando Guardián de Contenido de Vercel Blob...");

  const reportDir = path.resolve(process.cwd(), "reports", "vercel-blob");
  const reportPath = path.resolve(reportDir, "content-diagnostics.json");

  // --- [INICIO DE REFACTORIZACIÓN DE TIPO] ---
  // Se define un tipo explícito para el error de validación de Zod.
  type ValidationError = z.ZodError | null;

  const report = {
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
    validationError: null as ValidationError, // <-- TIPO SEGURO APLICADO
    summary: "",
  };
  // --- [FIN DE REFACTORIZACIÓN DE TIPO] ---

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
      report.validationError = validation.error; // <-- El tipo ahora coincide
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
    // Se asegura que 'validationError' se serialice correctamente
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
    logger.endGroup();
    logger.endTrace(traceId);
    if (report.validationStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseBlobContent();
