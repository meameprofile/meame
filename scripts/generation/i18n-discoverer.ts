// RUTA: scripts/generation/_utils/i18n-discoverer.ts
/**
 * @file i18n-discoverer.ts
 * @description Utilidad pura y atómica del entorno de build. Escanea el proyecto
 *              en busca de archivos de contenido .i18n.json y los parsea de
 *              forma resiliente. Es arquitectónicamente puro.
 * @version 1.0.0 (Architecturally Pure)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as fs from "fs/promises";
import * as path from "path";
import chalk from "chalk";

const CONTENT_ROOT_DIR = path.resolve(process.cwd(), "src");
const DEV_CONTENT_PATHS_TO_IGNORE = [
  path.join("messages", "components", "dev"),
  path.join("messages", "pages", "dev"),
];

export type I18nFileContent = { [key: string]: Record<string, unknown> };

export type DiscoveryResult = {
  files: string[];
  contents: I18nFileContent[];
};

export async function discoverAndReadI18nFiles(options?: {
  excludeDevContent?: boolean;
}): Promise<DiscoveryResult> {
  const { excludeDevContent = false } = options || {};
  console.log(chalk.gray("   Iniciando descubrimiento de archivos i18n..."));

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
              `   [ADVERTENCIA] No se pudo leer o parsear ${path.relative(
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
    console.warn(
      chalk.yellow(
        `   [ADVERTENCIA] No se pudo escanear ${path.relative(
          process.cwd(),
          CONTENT_ROOT_DIR
        )}. Razón: ${errorMessage}`
      )
    );
  }

  console.log(
    chalk.gray(
      `   Descubrimiento finalizado: ${contents.length} archivos procesados.`
    )
  );
  return { files, contents };
}
