// RUTA: src/shared/lib/i18n/campaign.data.loader.ts
/**
 * @file campaign.data.loader.ts
 * @description Aparato Atómico: Cargador de Activos JSON, con resiliencia mejorada.
 * @version 6.0.0 (Granular Error Handling & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";

type AssetRoot = "campaigns" | "theme-fragments";

const ASSET_ROOT_PATH_MAP: Record<AssetRoot, string> = {
  campaigns: path.join(process.cwd(), "content"),
  "theme-fragments": path.join(process.cwd(), "content"),
};

export async function loadJsonAsset<T>(
  rootDir: AssetRoot,
  ...pathSegments: string[]
): Promise<T> {
  const baseDir = ASSET_ROOT_PATH_MAP[rootDir];
  const fullPath = path.join(baseDir, rootDir, ...pathSegments);
  const relativePath = path.relative(process.cwd(), fullPath);
  logger.trace(`[Cargador] Cargando activo JSON desde: "${relativePath}"`);

  try {
    const fileContent = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error: unknown) {
    // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA] ---
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[Cargador] Fallo crítico al cargar activo desde "${relativePath}"`,
      { error: errorMessage }
    );

    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(
        `Activo no encontrado en la ruta especificada: ${relativePath}`
      );
    }
    throw new Error(
      `No se pudo cargar o parsear el activo JSON: ${relativePath}. Causa: ${errorMessage}`
    );
    // --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA] ---
  }
}
