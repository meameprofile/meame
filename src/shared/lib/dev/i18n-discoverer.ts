// RUTA: src/shared/lib/dev/i18n-discoverer.ts
/**
 * @file i18n-discoverer.ts
 * @description Utilidad pura y atómica del lado del servidor. Escanea el proyecto
 *              en busca de archivos de contenido .i18n.json, los lee y los parsea.
 * @version 5.0.0 (Holistic Discovery)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import * as fs from "fs/promises";
import * as path from "path";

import chalk from "chalk";

import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

const CONTENT_ROOT_DIR = path.resolve(process.cwd(), "src");

const DEV_CONTENT_PATHS_TO_IGNORE = [
  path.join("messages", "components", "dev"),
  path.join("messages", "pages", "dev"),
];

export type I18nFileContent = Partial<Record<Locale, Record<string, unknown>>>;

export interface DiscoveryResult {
  files: string[];
  contents: I18nFileContent[];
}

export async function discoverAndReadI18nFiles(options?: {
  excludeDevContent?: boolean;
}): Promise<DiscoveryResult> {
  const { excludeDevContent = false } = options || {};
  logger.trace(
    "[i18n-discoverer] Iniciando descubrimiento holístico de archivos (v5.0)..."
  );

  const files: string[] = [];
  const contents: I18nFileContent[] = [];

  try {
    const dirEntries = await fs.readdir(CONTENT_ROOT_DIR, {
      recursive: true,
      withFileTypes: true,
    });

    for (const entry of dirEntries) {
      if (entry.isFile() && entry.name.endsWith(".i18n.json")) {
        const filePath = path.join(entry.path, entry.name);

        if (
          excludeDevContent &&
          DEV_CONTENT_PATHS_TO_IGNORE.some((devPath) =>
            filePath.includes(devPath)
          )
        ) {
          continue;
        }

        try {
          const contentString = await fs.readFile(filePath, "utf-8");
          const parsedContent = JSON.parse(contentString);
          files.push(filePath);
          contents.push(parsedContent);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.warn(
            chalk.yellow(
              `[i18n-discoverer] ADVERTENCIA: No se pudo leer o parsear ${path.relative(
                process.cwd(),
                filePath
              )}. Se omitirá. Razón: ${errorMessage}`
            )
          );
        }
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.warn(
      `[i18n-discoverer] ADVERTENCIA: No se pudo escanear el directorio raíz ${path.relative(process.cwd(), CONTENT_ROOT_DIR)}. Razón: ${errorMessage}`
    );
  }

  logger.trace(
    `Descubrimiento finalizado. Se procesaron ${contents.length} archivos de contenido.`
  );
  return { files, contents };
}
