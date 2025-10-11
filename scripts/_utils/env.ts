// RUTA: scripts/_utils/env.ts
/**
 * @file env.ts
 * @description SSoT para la carga y validación de variables de entorno para scripts.
 * @version 1.0.0 (Sovereign & Elite)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as path from "path";

import chalk from "chalk";
import * as dotenv from "dotenv";

/**
 * @function loadEnvironment
 * @description Carga variables de entorno desde .env.local y valida la presencia de claves requeridas.
 * @param {string[]} [requiredKeys=[]] - Un array de claves de entorno que deben estar presentes.
 * @throws {Error} Si alguna de las claves requeridas no se encuentra, terminando el proceso.
 */
export function loadEnvironment(requiredKeys: string[] = []): void {
  const envFile = ".env.local";
  const envPath = path.resolve(process.cwd(), envFile);

  dotenv.config({ path: envPath });

  if (requiredKeys.length > 0) {
    const missingKeys = requiredKeys.filter((key) => !process.env[key]);

    if (missingKeys.length > 0) {
      console.error(
        chalk.red.bold(
          `\n❌ [FALLO DE ENTORNO] Faltan las siguientes variables requeridas en '${envFile}':`
        )
      );
      missingKeys.forEach((key) => console.error(chalk.yellow(`  - ${key}`)));
      process.exit(1); // Falla rápido para prevenir errores en tiempo de ejecución.
    }
  }
}
