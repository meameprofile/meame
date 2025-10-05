// RUTA: scripts/validation/validate-blob-db-consistency.ts
/**
 * @file validate-blob-db-consistency.ts
 * @description Guardián de Integridad Inter-Dominio. Verifica la consistencia
 *              referencial entre las grabaciones de Vercel Blob y la tabla
 *              'visitor_sessions' de Supabase.
 * @version 1.0.0 (Production Ready)
 * @author RaZ Podestá - MetaShark Tech
 */
import { list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { createScriptClient } from "../_utils/supabaseClient";
import { loadEnvironment } from "../_utils/env";
import { scriptLogger as logger } from "../_utils/logger";

async function validateBlobDbConsistency() {
  const traceId = logger.startTrace("validateBlobDbConsistency_v1.0");
  logger.startGroup(
    "🔗 Iniciando Guardián de Integridad Inter-Dominio (Blob <-> DB)..."
  );

  const reportDir = path.resolve(process.cwd(), "reports", "consistency");
  const reportPath = path.resolve(reportDir, "blob-db-consistency-report.json");

  const report = {
    reportMetadata: {
      /* ... */
    },
    instructionsForAI: [
      "Este informe audita la consistencia entre Vercel Blob y Supabase.",
      "Analiza 'orphanBlobs' (sesiones en Blob que no están en la DB).",
      "Analiza 'ghostSessions' (sesiones en la DB que no tienen grabaciones en Blob).",
    ],
    auditStatus: "FAILED",
    analysis: {
      blobSessionIds: 0,
      dbSessionIds: 0,
      orphanBlobs: [] as string[],
      ghostSessions: [] as string[],
    },
    summary: "",
  };

  try {
    loadEnvironment([
      "BLOB_READ_WRITE_TOKEN",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);

    // 1. Censo de Blobs
    logger.info("Fase 1/3: Realizando censo de sesiones en Vercel Blob...");
    const { blobs } = await list({ prefix: "sessions/" });
    const blobSessionIds = new Set(blobs.map((b) => b.pathname.split("/")[1]));
    report.analysis.blobSessionIds = blobSessionIds.size;
    logger.success(
      `Censo de Blob completo. ${blobSessionIds.size} sesiones únicas encontradas.`
    );

    // 2. Censo de Sesiones en DB
    logger.info("Fase 2/3: Realizando censo de sesiones en Supabase DB...");
    const supabase = createScriptClient();
    const { data: sessions, error } = await supabase
      .from("visitor_sessions")
      .select("session_id");
    if (error) throw new Error(`Error de Supabase: ${error.message}`);
    const dbSessionIds = new Set(sessions.map((s) => s.session_id));
    report.analysis.dbSessionIds = dbSessionIds.size;
    logger.success(
      `Censo de DB completo. ${dbSessionIds.size} sesiones encontradas.`
    );

    // 3. Análisis de Desviación
    logger.info("Fase 3/3: Analizando desviaciones entre dominios...");
    report.analysis.orphanBlobs = [...blobSessionIds].filter(
      (id) => !dbSessionIds.has(id)
    );
    report.analysis.ghostSessions = [...dbSessionIds].filter(
      (id) => !blobSessionIds.has(id)
    );

    const discrepancyCount =
      report.analysis.orphanBlobs.length + report.analysis.ghostSessions.length;
    if (discrepancyCount > 0) {
      throw new Error(`Se encontraron ${discrepancyCount} inconsistencias.`);
    }

    report.auditStatus = "SUCCESS";
    report.summary =
      "✅ ¡Éxito! La integridad entre Vercel Blob y la base de datos es absoluta.";
    logger.success(report.summary);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    report.summary = `Auditoría de consistencia fallida: ${errorMessage}`;
    logger.error(report.summary, { analysis: report.analysis, traceId });
  } finally {
    await fs.mkdir(reportDir, { recursive: true }).catch(() => {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    logger.info(
      `Informe de consistencia guardado en: ${path.relative(process.cwd(), reportPath)}`
    );
    logger.endGroup();
    logger.endTrace(traceId);
    if (report.auditStatus === "FAILED") {
      process.exit(1);
    }
  }
}

validateBlobDbConsistency();
