// RUTA: scripts/supabase/seeding/fix-orphan-blobs.ts
/**
 * @file fix-orphan-blobs.ts
 * @description Script de nivelación para purgar blobs huérfanos de Vercel Blob.
 * @version 1.1.0 (Sovereign Path Restoration & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
import { list, del } from "@vercel/blob";
import { createScriptClient } from "../../_utils/supabaseClient";
import { loadEnvironment } from "../../_utils/env";
import { scriptLogger as logger } from "../../_utils/logger";

async function fixOrphanBlobs() {
  const traceId = logger.startTrace("fixOrphanBlobs_v1.1");
  logger.startGroup(`[Nivelación] Purgando blobs huérfanos...`);

  try {
    // Pilar de Calidad: Carga y validación explícita de variables de entorno.
    loadEnvironment(["BLOB_READ_WRITE_TOKEN"]);

    const supabase = createScriptClient();

    logger.info(
      "Fase 1/3: Obteniendo todas las sesiones de la base de datos..."
    );
    const { data: sessions, error: dbError } = await supabase
      .from("visitor_sessions")
      .select("session_id");
    if (dbError) throw dbError;
    const dbSessionIds = new Set(sessions.map((s) => s.session_id));
    logger.success(`${dbSessionIds.size} sesiones encontradas en la DB.`);

    logger.info(
      "Fase 2/3: Listando todos los blobs de sesión en Vercel Blob..."
    );
    const { blobs } = await list({ prefix: "sessions/", mode: "expanded" });
    const blobPathnames = blobs.map((b) => b.pathname);
    logger.success(
      `${blobPathnames.length} blobs encontrados en el almacenamiento.`
    );

    logger.info("Fase 3/3: Identificando blobs huérfanos...");
    const orphanBlobs = blobPathnames.filter((pathname) => {
      const sessionId = pathname.split("/")[1];
      return !dbSessionIds.has(sessionId);
    });

    if (orphanBlobs.length === 0) {
      logger.success(
        "¡Excelente! No se encontraron blobs huérfanos. La integridad es total."
      );
      return;
    }

    logger.warn(
      `Se encontraron ${orphanBlobs.length} blobs huérfanos. Iniciando purga...`
    );
    console.log(orphanBlobs);

    // La función 'del' espera un array de URLs, no de pathnames.
    const blobUrlsToDelete = blobs
      .filter((b) => orphanBlobs.includes(b.pathname))
      .map((b) => b.url);

    if (blobUrlsToDelete.length > 0) {
      await del(blobUrlsToDelete);
      logger.success(
        `Purga completada. Se eliminaron ${orphanBlobs.length} blobs huérfanos.`
      );
    }
  } catch (error) {
    // Guardián de Resiliencia
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante la limpieza de blobs.", {
      error: msg,
      traceId,
    });
    process.exit(1);
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

fixOrphanBlobs();
