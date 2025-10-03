// RUTA: src/shared/lib/ssg/programmatic-builder.ts
/**
 * @file programmatic-builder.ts
 * @description Utilidad de bajo nivel para invocar el build de Next.js de forma
 *              programática. v3.0.0 (Package Manager Agnostic): Ahora detecta
 *              automáticamente el gestor de paquetes (npm, yarn, pnpm) en uso,
 *              eliminando la dependencia harcodeada y garantizando la portabilidad.
 * @version 3.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { spawn } from "child_process";
import { logger } from "@/shared/lib/logging";

/**
 * @function detectPackageManager
 * @description Detecta el gestor de paquetes que está ejecutando el script
 *              actualmente a través de la variable de entorno `npm_execpath`.
 * @returns {'pnpm' | 'yarn' | 'npm'} El nombre del gestor de paquetes.
 * @private
 */
function detectPackageManager(): "pnpm" | "yarn" | "npm" {
  const execpath = process.env.npm_execpath || "";
  if (execpath.includes("pnpm")) return "pnpm";
  if (execpath.includes("yarn")) return "yarn";
  return "npm";
}

/**
 * @function runScopedNextBuild
 * @description Ejecuta el comando `next build` dentro de un directorio específico,
 *              utilizando el gestor de paquetes detectado automáticamente.
 * @param {string} tempDir - La ruta al directorio donde se ejecutará el build.
 * @param {string} traceId - El ID de traza para la observabilidad.
 * @returns {Promise<void>} Una promesa que se resuelve si el build es exitoso
 *          o se rechaza si falla.
 */
export function runScopedNextBuild(
  tempDir: string,
  traceId: string
): Promise<void> {
  const detectedPm = detectPackageManager();
  logger.info(`[Motor de Forja] Iniciando proceso de build de Next.js...`, {
    directory: tempDir,
    packageManager: detectedPm,
    traceId,
  });

  return new Promise((resolve, reject) => {
    try {
      const buildProcess = spawn(detectedPm, ["next", "build"], {
        cwd: tempDir,
        stdio: ["ignore", "pipe", "pipe"],
        shell: true, // Necesario en Windows para resolver el comando del gestor de paquetes
        env: { ...process.env },
      });

      let stderr = "";
      buildProcess.stdout?.on("data", (data: Buffer) => {
        // Se reduce el ruido del log, mostrando solo en modo trace
        logger.trace(`[Next Build - STDOUT]: ${data.toString().trim()}`, {
          traceId,
        });
      });
      buildProcess.stderr?.on("data", (data: Buffer) => {
        const line = data.toString().trim();
        logger.error(`[Next Build - STDERR]: ${line}`, { traceId });
        stderr += line + "\n";
      });

      buildProcess.on("close", (code) => {
        if (code === 0) {
          logger.success(
            "El proceso de build de Next.js ha finalizado con éxito.",
            { traceId }
          );
          resolve();
        } else {
          const errorMessage = `El build de Next.js falló con código ${code}`;
          logger.error(errorMessage, { traceId });
          reject(new Error(`${errorMessage}\n--- Errores ---\n${stderr}`));
        }
      });

      buildProcess.on("error", (err) => {
        const errorMessage =
          "No se pudo iniciar el proceso de build de Next.js.";
        logger.error(errorMessage, { error: err, traceId });
        reject(new Error(`${errorMessage}: ${err.message}`));
      });
    } catch (error) {
      // Guardián de Resiliencia para errores en el `spawn`
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido.";
      logger.error(
        "[Motor de Forja] Fallo crítico al intentar iniciar el proceso de build.",
        { error: errorMessage, traceId }
      );
      reject(new Error(`Fallo al iniciar el build: ${errorMessage}`));
    }
  });
}
