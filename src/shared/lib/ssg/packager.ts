// RUTA: shared/lib/ssg/packager.ts
/**
 * @file packager.ts
 * @description Utilidad de bajo nivel para empaquetar un directorio en un
 *              archivo .zip. SSoT para la lógica de compresión.
 *              v2.1.0 (Observability & Route Correction): Se añade un log de traza
 *              al inicio del módulo para confirmar su carga, se corrige el comentario
 *              de ruta y se permite la inyección de un `traceId` para una trazabilidad
 *              mejorada.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import fs from "fs";
import archiver from "archiver";
import { logger } from "@/shared/lib/logging";

// --- INICIO DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---
logger.trace("[ssg/packager.ts] Módulo 'packager' cargado y listo para usar.");
// --- FIN DE MEJORA: OBSERVABILIDAD DE CARGA DE MÓDULO ---

/**
 * @function packageDirectory
 * @description Comprime el contenido de un directorio fuente en un archivo .zip de destino.
 * @param {string} sourceDir - La ruta al directorio que se va a comprimir.
 * @param {string} outPath - La ruta completa del archivo .zip de salida.
 * @param {string} [traceId] - Opcional. Un ID de traza para correlacionar los logs.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la compresión ha finalizado.
 */
export function packageDirectory(
  sourceDir: string,
  outPath: string,
  traceId?: string
): Promise<void> {
  const currentTraceId = traceId || logger.startTrace("packageDirectory"); // Usa el traceId proporcionado o inicia uno nuevo
  logger.info("[Zipper] Iniciando compresión de directorio...", {
    sourceDir,
    outPath,
    traceId: currentTraceId,
  });

  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", { zlib: { level: 9 } }); // Máxima compresión

  return new Promise((resolve, reject) => {
    output.on("close", () => {
      const sizeInKb = (archive.pointer() / 1024).toFixed(2);
      logger.success(
        `[Zipper] Paquete .zip creado con éxito. Tamaño total: ${sizeInKb} KB`,
        { outPath, traceId: currentTraceId }
      );
      if (!traceId) logger.endTrace(currentTraceId); // Solo finaliza si se inició aquí
      resolve();
    });

    archive.on("error", (err) => {
      logger.error("[Zipper] Error durante el archivado .zip.", {
        err,
        traceId: currentTraceId,
      });
      if (!traceId) logger.endTrace(currentTraceId, { error: err.message }); // Finaliza y añade contexto de error
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
