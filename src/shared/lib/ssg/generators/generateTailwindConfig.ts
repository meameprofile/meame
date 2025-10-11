// RUTA: src/shared/lib/ssg/generators/generateTailwindConfig.ts
/**
 * @file generateTailwindConfig.ts
 * @description Módulo generador soberano para el archivo tailwind.config.ts.
 * @version 2.0.0 (Elite Compliance & v4 Syntax)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";

export async function generateTailwindConfig(targetDir: string): Promise<void> {
  logger.trace("[Generator] Iniciando generación de tailwind.config.ts...");

  const configContent = `
import type { Config } from "tailwindcss";

/**
 * @file tailwind.config.ts
 * @description Configuración de Tailwind CSS para el sitio estático exportado.
 *              Generado por el Motor de Forja de élite.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // En Tailwind v4, la configuración del tema (theme) y los plugins
  // se gestionan principalmente en el archivo CSS global.
};
export default config;
`;

  try {
    const filePath = path.join(targetDir, "tailwind.config.ts");
    await fs.writeFile(filePath, configContent.trim());
    logger.trace(
      `[Generator] Archivo tailwind.config.ts escrito exitosamente.`
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al generar tailwind.config.ts.", {
      error: errorMessage,
    });
    throw error;
  }
}
