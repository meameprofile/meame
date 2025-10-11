// RUTA: src/shared/lib/ssg/generators/generateThemeFile.ts
/**
 * @file generateThemeFile.ts
 * @description Módulo generador soberano para el archivo de configuración de tema (layout).
 * @version 2.0.0 (Database-Driven Theming)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export async function generateThemeFile(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de content/theme.json...");

  try {
    const themeObject = {
      layout: {
        sections: draft.layoutConfig,
      },
    };

    const contentDir = path.join(targetDir, "src", "content");
    await fs.mkdir(contentDir, { recursive: true });

    const fileContent = JSON.stringify(themeObject, null, 2);
    const filePath = path.join(contentDir, "theme.json");
    await fs.writeFile(filePath, fileContent);

    logger.trace(`[Generator] Archivo theme.json escrito exitosamente.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico al generar theme.json.", {
      error: errorMessage,
    });
    throw error;
  }
}
