// RUTA: scripts/supabase/generation/generate-db-types.ts
/**
 * @file generate-db-types.ts
 * @description Guardián Soberano para la generación de tipos de Supabase.
 *              v1.3 (Sovereign Landmark Parsing): Implementa una lógica de
 *              parseo resiliente que localiza el inicio del código válido y
 *              descarta cualquier "ruido" de terminal precedente.
 * @version 1.3.0
 * @author L.I.A. Legacy
 */
/* eslint-env node */
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";

const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src/shared/lib/supabase/database.types.ts"
);
const PROJECT_ID = "lbdhtkfsnosfttorlblh";
const COMMAND = `pnpm supabase gen types typescript --project-id ${PROJECT_ID} --schema public`;

async function generateTypes() {
  console.log(
    chalk.blue.bold("🛡️  Ejecutando Guardián de Generación de Tipos v1.3...")
  );

  return new Promise<void>((resolve, reject) => {
    exec(COMMAND, async (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red.bold("🔥 Fallo crítico al ejecutar la CLI de Supabase:")
        );
        console.error(chalk.red(stderr));
        return reject(error);
      }

      // --- [INICIO DE REFACTORIZACIÓN SOBERANA: PARSEO POR LANDMARK] ---
      // En lugar de limpiar, buscamos el primer punto de partida válido y canónico.
      const startIndex = stdout.indexOf("export type Json");

      if (startIndex === -1) {
        const errorMessage =
          "La salida de la CLI de Supabase no contiene el código de tipos esperado. La SSoT no pudo ser generada.";
        console.error(chalk.red.bold(`🔥 ${errorMessage}`));
        console.error(chalk.yellow("Salida recibida:"), stdout);
        return reject(new Error(errorMessage));
      }

      // Tomamos todo desde el landmark hasta el final del archivo.
      const cleanOutput = stdout.substring(startIndex);
      // --- [FIN DE REFACTORIZACIÓN SOBERANA] ---

      try {
        await fs.writeFile(OUTPUT_FILE, cleanOutput, "utf-8");
        console.log(
          chalk.green(
            `✅ SSoT de Tipos de Base de Datos regenerada con éxito en: ${path.relative(
              process.cwd(),
              OUTPUT_FILE
            )}`
          )
        );
        resolve();
      } catch (writeError) {
        console.error(
          chalk.red.bold("🔥 Fallo crítico al escribir el archivo de tipos:")
        );
        console.error(chalk.red(writeError));
        reject(writeError);
      }
    });
  });
}

generateTypes().catch(() => process.exit(1));
