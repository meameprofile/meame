// Ruta correcta: src/shared/lib/ssg/generators/generate-content-file.ts
/**
 * @file generate-content-file.ts
 * @description Módulo generador soberano para el archivo de contenido de la campaña (content.json).
 *              v3.0.0 (Holistic Refactor & DRY Principle): Refactorizado para
 *              reutilizar la lógica soberana de `campaignDataTransformer` y
 *              resolver todos los errores de tipo y de importación.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { transformDraftToContentObject } from "@/shared/lib/utils/campaign-suite/campaignDataTransformer";

/**
 * @function generateContentFile
 * @description Transforma los datos del borrador utilizando el transformador soberano
 *              y escribe el resultado en un archivo `content.json`.
 * @param {CampaignDraft} draft - El borrador de la campaña.
 * @param {string} targetDir - El directorio raíz del proyecto exportado.
 * @returns {Promise<void>}
 * @throws {Error} Si la operación de escritura falla.
 */
export async function generateContentFile(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace(
    "[Generator] Iniciando generación de content.json (v3.0 - DRY)..."
  );

  try {
    const contentObject = transformDraftToContentObject(draft);

    const contentDir = path.join(targetDir, "content");
    await fs.mkdir(contentDir, { recursive: true });

    const fileContent = JSON.stringify(contentObject, null, 2);
    const filePath = path.join(contentDir, "content.json");
    await fs.writeFile(filePath, fileContent);

    logger.trace(
      `[Generator] Archivo content.json escrito exitosamente en: ${filePath}`
    );
  } catch (error) {
    logger.error("[Generator] Fallo crítico al generar content.json.", {
      error,
    });
    // Propaga el error para que el pipeline de build lo capture y se detenga.
    throw error;
  }
}
// Ruta correcta: src/shared/lib/ssg/generators/generate-content-file.ts
