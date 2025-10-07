// RUTA: scripts/run-with-env.ts
/**
 * @file run-with-env.ts
 * @description Orquestador soberano para la ejecución de scripts. Carga el entorno
 *              y la configuración de rutas de TypeScript ANTES de importar y
 *              ejecutar el script objetivo.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "dotenv/config";
import path from "path";
import { register } from "tsconfig-paths";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import { scriptLogger as logger } from "./_utils/logger";

// Carga y parsea el tsconfig.scripts.json para obtener los 'paths'.
const tsconfigPath = path.resolve(process.cwd(), "tsconfig.scripts.json");
const tsconfigFileContent = readFileSync(tsconfigPath, "utf-8").replace(
  /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  (match, group1) => (group1 ? "" : match)
);
const tsconfig = JSON.parse(tsconfigFileContent);

// REGISTRA los alias de ruta ANTES de cualquier otra operación.
register({
  baseUrl: path.resolve(process.cwd(), tsconfig.compilerOptions.baseUrl || "."),
  paths: tsconfig.compilerOptions.paths,
});

async function runScript() {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    logger.error("No se especificó la ruta del script a ejecutar.");
    process.exit(1);
  }

  try {
    const absolutePath = path.resolve(process.cwd(), scriptPath);
    const scriptUrl = pathToFileURL(absolutePath).href;

    // Importa dinámicamente el módulo del script.
    const scriptModule = await import(scriptUrl);

    // Asume que el script exporta una función 'default' y la ejecuta.
    if (typeof scriptModule.default === "function") {
      await scriptModule.default();
    }
  } catch (error) {
    logger.error(`Fallo crítico al ejecutar '${scriptPath}'`, { error });
    process.exit(1);
  }
}

runScript();
