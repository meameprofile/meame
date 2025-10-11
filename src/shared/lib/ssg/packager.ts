// RUTA: src/shared/lib/ssg/packager.ts
/**
 * @file packager.ts
 * @description Utilidad de bajo nivel para empaquetar un directorio en un
 *              archivo .zip. SSoT para la lógica de compresión.
 * @version 2.3.0 (Definitive Type Safety & Observability Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import fs from "fs";

import archiver from "archiver";

import { logger } from "@/shared/lib/logging";

logger.trace("[ssg/packager.ts] Módulo 'packager' cargado y listo para usar.");

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
  const currentTraceId = traceId || logger.startTrace("packageDirectory");
  logger.info("[Zipper] Iniciando compresión de directorio...", {
    sourceDir,
    outPath,
    traceId: currentTraceId,
  });

  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on("close", () => {
      const sizeInKb = (archive.pointer() / 1024).toFixed(2);
      logger.success(
        `[Zipper] Paquete .zip creado con éxito. Tamaño total: ${sizeInKb} KB`,
        { outPath, traceId: currentTraceId }
      );
      if (!traceId) logger.endTrace(currentTraceId);
      resolve();
    });

    archive.on("error", (err) => {
      logger.error("[Zipper] Error durante el archivado .zip.", {
        err,
        traceId: currentTraceId,
      });
      // --- [INICIO DE CORRECCIÓN DE CONTRATO] ---
      // La propiedad 'error' debe ser un booleano para señalar el estado de fallo.
      if (!traceId) logger.endTrace(currentTraceId, { error: true });
      // --- [FIN DE CORRECCIÓN DE CONTRATO] ---
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
