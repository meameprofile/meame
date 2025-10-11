// RUTA: src/shared/lib/ssg/generators/generateContentFile.ts
/**
 * @file generateContentFile.ts
 * @description Módulo generador soberano para el archivo de contenido de la campaña.
 * @version 2.0.0 (DRY Principle via Transformer)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { transformDraftToContentObject } from "@/shared/lib/utils/campaign-suite/campaignDataTransformer";

export async function generateContentFile(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de content.json...");

  try {
    const contentObject = transformDraftToContentObject(draft);

    const contentDir = path.join(targetDir, "src", "content");
    await fs.mkdir(contentDir, { recursive: true });

    const fileContent = JSON.stringify(contentObject, null, 2);
    const filePath = path.join(contentDir, "content.json");
    await fs.writeFile(filePath, fileContent);

    logger.trace(`[Generator] Archivo content.json escrito exitosamente.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al generar content.json.", { error: errorMessage });
    throw error;
  }
}
