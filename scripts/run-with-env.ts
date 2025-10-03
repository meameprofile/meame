// scripts/run-with-env.ts
/**
 * @file run-with-env.ts
 * @description Orquestador original, ahora funcional y resiliente a comentarios en JSON.
 * @version 8.2.0 (JSON Comment Resilience)
 */
import "dotenv/config";
import path from "path";
import { register } from "tsconfig-paths";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import { logger } from "@/shared/lib/logging"; // Ahora importa el SHIM

const tsconfigPath = path.resolve(process.cwd(), "tsconfig.scripts.json");

// **INICIO DE LA CORRECCIÓN DE RESILIENCIA**
// Esta expresión regular elimina los comentarios de un archivo JSON antes de parsearlo.
const tsconfigFileContent = readFileSync(tsconfigPath, "utf-8").replace(
  /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  (match, group1) => (group1 ? "" : match)
);
// **FIN DE LA CORRECCIÓN DE RESILIENCIA**

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
    // La importación dinámica ejecutará el script exportado por defecto
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
