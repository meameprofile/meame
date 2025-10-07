// RUTA: scripts/supabase/generation/generate-db-types.ts
/**
 * @file generate-db-types.ts
 * @description Guardián Soberano para la generación de tipos de Supabase.
 *              v4.0.0 (Holistic Environment Injection): Refactorizado para inyectar
 *              explícitamente las variables de entorno en el proceso hijo,
 *              resolviendo fallos de autenticación de la CLI de Supabase.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
/* eslint-env node */
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import { scriptLogger as logger } from "../../_utils/logger";

const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src/shared/lib/supabase/database.types.ts"
);
const PROJECT_ID = "lbdhtkfsnosfttorlblh";
const COMMAND = `pnpm supabase gen types typescript --project-id ${PROJECT_ID} --schema public`;

async function generateTypes() {
  const traceId = logger.startTrace("generateDbTypes_v4.0");
  const groupId = logger.startGroup(
    "🛡️  Ejecutando Guardián de Generación de Tipos v4.0..."
  );

  return new Promise<void>((resolve, reject) => {
    // --- [INICIO DE REFACTORIZACIÓN DE NIVELACIÓN v4.0.0] ---
    // Se inyecta el entorno del proceso padre al proceso hijo para
    // asegurar que la CLI de Supabase reciba el SUPABASE_ACCESS_TOKEN.
    exec(COMMAND, { env: process.env }, async (error, stdout, stderr) => {
      // --- [FIN DE REFACTORIZACIÓN DE NIVELACIÓN v4.0.0] ---
      if (error) {
        logger.error("🔥 Fallo crítico al ejecutar la CLI de Supabase:", {
          stderr,
          traceId,
        });

        if (stderr.includes("Access token not provided")) {
          console.error(
            chalk.yellow.bold(
              "\n[DIAGNÓSTICO DE ÉLITE] Fallo de Autenticación de la CLI de Supabase."
            )
          );
          console.error(
            chalk.yellow(
              "  › Causa: El Access Token no fue proporcionado o es inválido.\n" +
                "  › Solución 1: Ejecuta 'pnpm supabase login' para autenticarte.\n" +
                "  › Solución 2: Asegúrate de que la variable 'SUPABASE_ACCESS_TOKEN' en tu .env.local sea correcta y válida."
            )
          );
        }

        logger.endGroup(groupId);
        return reject(error);
      }

      const startIndex = stdout.indexOf("export type Json");
      if (startIndex === -1) {
        const errorMessage =
          "La salida de la CLI de Supabase no contiene el código de tipos esperado.";
        logger.error(`🔥 ${errorMessage}`, { output: stdout, traceId });
        logger.endGroup(groupId);
        return reject(new Error(errorMessage));
      }

      const cleanOutput = stdout.substring(startIndex);
      try {
        await fs.writeFile(OUTPUT_FILE, cleanOutput, "utf-8");
        logger.success(
          `✅ SSoT de Tipos de Base de Datos regenerada con éxito en: ${path.relative(
            process.cwd(),
            OUTPUT_FILE
          )}`,
          { traceId }
        );
        logger.endGroup(groupId);
        resolve();
      } catch (writeError) {
        logger.error("🔥 Fallo crítico al escribir el archivo de tipos:", {
          writeError,
          traceId,
        });
        logger.endGroup(groupId);
        reject(writeError);
      }
    });
  });
}

generateTypes().catch(() => process.exit(1));
