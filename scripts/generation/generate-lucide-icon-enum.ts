// RUTA: scripts/generation/generate-lucide-icon-enum.ts
/**
 * @file generate-lucide-icon-enum.ts
 * @description Script de automatización de élite para la DX.
 *              v6.2.0 (Module System Integrity Fix): Resuelve la colisión del
 *              identificador 'require' al usar un nombre no reservado,
 *              restaurando la compatibilidad con el compilador de TypeScript.
 * @version 6.2.0
 *@author RaZ Podestá - MetaShark Tech
 */
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { createRequire } from "module";

// --- [INICIO DE CORRECCIÓN DE INTEGRIDAD DE MÓDULO] ---
// Se renombra 'require' a 'customRequire' para evitar colisión con
// los identificadores reservados del compilador en el ámbito del módulo.
const customRequire = createRequire(import.meta.url);
// --- [FIN DE CORRECCIÓN DE INTEGRIDAD DE MÓDULO] ---

const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src",
  "shared",
  "lib",
  "config",
  "lucide-icon-names.ts"
);

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function main() {
  console.log(
    chalk.blue.bold(
      "🚀 Iniciando generación del Zod Enum para iconos de Lucide (v6.2)..."
    )
  );

  try {
    const lucideManifestPath = customRequire.resolve(
      // <-- Se utiliza el importador renombrado
      "lucide-react/dynamicIconImports"
    );
    console.log(
      chalk.gray(
        `   Manifiesto de iconos encontrado en: ${path.relative(
          process.cwd(),
          lucideManifestPath
        )}`
      )
    );

    const manifestContent = fs.readFileSync(lucideManifestPath, "utf-8");
    const iconKeysMatches = manifestContent.matchAll(/['"]([^'"]+)['"]:/g);
    const iconKeys = Array.from(iconKeysMatches, (m) => m[1]);

    if (iconKeys.length === 0) {
      throw new Error(
        "No se encontraron claves de iconos en el manifiesto. ¿Cambió el formato del archivo de lucide-react?"
      );
    }

    const pascalCaseIconNames = iconKeys.map(kebabToPascal);

    const fileContent = `// RUTA: src/shared/lib/config/lucide-icon-names.ts
/**
 * @file lucide-icon-names.ts
 * @description Manifiesto de Nombres de Iconos de Lucide y SSoT.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute 'pnpm gen:icons' para actualizarlo.
 * @author Script de Generación Automática
 * @version ${new Date().toISOString()}
 */
import { z } from "zod";

export const lucideIconNames = ${JSON.stringify(
      pascalCaseIconNames,
      null,
      2
    )} as const;

export const LucideIconNameSchema = z.enum(lucideIconNames);

export type LucideIconName = z.infer<typeof LucideIconNameSchema>;
`;

    console.log(
      chalk.cyan(
        `   Escribiendo manifiesto en la ruta SSoT: ${chalk.yellow(
          path.relative(process.cwd(), OUTPUT_FILE)
        )}`
      )
    );

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Zod Enum y Tipo generados con éxito con ${pascalCaseIconNames.length} iconos registrados.`
      )
    );
  } catch (error) {
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del enum:"),
      error
    );
    process.exit(1);
  }
}

main();
