// RUTA: src/shared/lib/ssg/generators/generateNextConfig.ts
/**
 * @file generateNextConfig.ts
 * @description Módulo generador soberano para el archivo next.config.mjs.
 * @version 3.0.0 (Holistic Refactor & Simplification)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

/**
 * @function generateNextConfig
 * @description Genera un archivo next.config.mjs estandarizado y robusto,
 *              configurado para la exportación estática (`output: 'export'`).
 * @param {CampaignDraft} draft - El borrador de la campaña (reservado para uso futuro).
 * @param {string} targetDir - El directorio raíz del proyecto exportado.
 * @returns {Promise<void>}
 * @throws {Error} Si la operación de escritura de archivo falla.
 */
export async function generateNextConfig(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de next.config.mjs (v3.0)...");

  const configContent = `
/**
 * @file next.config.mjs
 * @description Configuración de Next.js para la campaña estática exportada.
 *              Este archivo es generado automáticamente por el Motor de Forja.
 * @version ${new Date().toISOString()}
 */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;

  try {
    const filePath = path.join(targetDir, "next.config.mjs");
    await fs.writeFile(filePath, configContent.trim());

    logger.trace(
      `[Generator] Archivo next.config.mjs escrito exitosamente en: ${filePath}`
    );
  } catch (error) {
    logger.error("[Generator] Fallo crítico al generar next.config.mjs.", {
      error,
    });
    throw error;
  }
}
