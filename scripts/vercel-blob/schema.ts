// RUTA: scripts/vercel-blob/schema.ts
/**
 * @file schema.ts
 * @description Guardián de Esquema para Vercel Blob, con lógica de validación
 *              de CUID2 restaurada y observabilidad de élite.
 * @version 2.1.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";

async function diagnoseBlobSchema() {
  const traceId = logger.startTrace("diagnoseBlobSchema_v2.1");
  const groupId = logger.startGroup(
    "📂 Iniciando Guardián de Esquema de Vercel Blob..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "vercel-blob");
  const reportPath = path.resolve(reportDir, "schema-diagnostics.json");

  const report = {
    reportMetadata: {
      script: "scripts/vercel-blob/schema.ts",
      purpose: "Validación de la estructura de rutas de blobs.",
      generatedAt: new Date().toISOString(),
    },
    instructionsForAI: [
      "Analiza 'auditStatus'. Un fallo indica que uno o más blobs no siguen la convención de nomenclatura 'sessions/{cuid2}/{timestamp}.json'.",
      "La lista 'invalidPaths' contiene los blobs que fallaron la validación.",
    ],
    auditStatus: "FAILED",
    blobsScanned: 0,
    invalidPaths: [] as { pathname: string; reason: string }[],
    summary: "",
  };

  try {
    loadEnvironment(["BLOB_READ_WRITE_TOKEN"]);
    logger.traceEvent(traceId, "Variables de entorno cargadas.");

    const { blobs } = await list({ prefix: "sessions/", limit: 500 });
    report.blobsScanned = blobs.length;
    logger.info(`Se encontraron ${blobs.length} blobs para auditar.`);

    if (blobs.length === 0) {
      report.auditStatus = "SUCCESS";
      report.summary =
        "Auditoría de esquema completada. No se encontraron blobs para verificar.";
      logger.warn(report.summary);
      return;
    }

    const pathRegex = /^sessions\/[a-z0-9]{24}\/\d{13,}\.json$/;

    for (const blob of blobs) {
      if (!pathRegex.test(blob.pathname)) {
        report.invalidPaths.push({
          pathname: blob.pathname,
          reason:
            "El formato no coincide con 'sessions/{cuid2}/{timestamp}.json'.",
        });
      }
    }

    if (report.invalidPaths.length > 0) {
      throw new Error(
        `${report.invalidPaths.length} de ${blobs.length} blobs tienen una estructura de ruta inválida.`
      );
    }

    report.auditStatus = "SUCCESS";
    report.summary = `Verificados ${blobs.length} blobs. Todos tienen una estructura de ruta válida.`;
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de esquema fallida: ${errorMessage}`;
    logger.error(report.summary, {
      invalidPaths: report.invalidPaths,
      traceId,
    });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    if (report.auditStatus === "FAILED") {
      process.exit(1);
    }
  }
}

diagnoseBlobSchema();
