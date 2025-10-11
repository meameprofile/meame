// RUTA: src/shared/lib/ssg/generators/generatePostcssConfig.ts
/**
 * @file generatePostcssConfig.ts
 * @description Módulo generador soberano para el archivo postcss.config.mjs.
 * @version 2.0.0 (Elite Compliance & v4 Syntax)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";

export async function generatePostcssConfig(targetDir: string): Promise<void> {
  logger.trace("[Generator] Iniciando generación de postcss.config.mjs...");

  const configContent = `
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

  try {
    const filePath = path.join(targetDir, "postcss.config.mjs");
    await fs.writeFile(filePath, configContent.trim());
    logger.trace(
      `[Generator] Archivo postcss.config.mjs escrito exitosamente.`
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al generar postcss.config.mjs.", {
      error: errorMessage,
    });
    throw error;
  }
}
