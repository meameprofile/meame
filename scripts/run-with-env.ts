// RUTA: scripts/run-with-env.ts
/**
 * @file run-with-env.ts
 * @description Orquestador soberano para la ejecución de scripts.
 * @version 9.1.0 (Architectural Boundary Restoration)
 * @author L.I.A. Legacy
 */
import "dotenv/config";
import path from "path";
import { register } from "tsconfig-paths";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---
// Se importa el logger soberano para el entorno de scripts.
import { scriptLogger as logger } from "./_utils/logger";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---

const tsconfigPath = path.resolve(process.cwd(), "tsconfig.scripts.json");
const tsconfigFileContent = readFileSync(tsconfigPath, "utf-8").replace(
  /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  (match, group1) => (group1 ? "" : match)
);
const tsconfig = JSON.parse(tsconfigFileContent);

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
    const scriptModule = await import(scriptUrl);
    if (typeof scriptModule.default === "function") {
      await scriptModule.default();
    }
  } catch (error) {
    logger.error(`Fallo crítico al ejecutar '${scriptPath}'`, { error });
    process.exit(1);
  }
}

runScript();
