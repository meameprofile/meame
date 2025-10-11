// RUTA: src/shared/lib/ssg/componentCopier.ts
/**
 * @file componentCopier.ts
 * @description Utilidad de élite para analizar y copiar recursivamente las
 *              dependencias de componentes. v3.0.0 (AST-Powered Resilience):
 *              Reemplaza el parseo frágil con Regex por un robusto análisis de
 *              Árbol de Sintaxis Abstracto (AST) utilizando @swc/core.
 * @version 3.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import * as swc from "@swc/core";

import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = path.join(PROJECT_ROOT, "src");

/**
 * @function resolveImportPath
 * @description Resuelve una ruta de importación con alias a una ruta de archivo física.
 * @param {string} importPath - La ruta de importación (ej. '@/components/ui').
 * @returns {Promise<string | null>} La ruta absoluta al archivo o null si no se resuelve.
 */
async function resolveImportPath(importPath: string): Promise<string | null> {
  const basePath = path.join(SRC_ROOT, importPath.replace("@/", ""));
  const potentialPaths = [
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];

  for (const p of potentialPaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // Intenta la siguiente ruta
    }
  }
  return null;
}

/**
 * @function resolveAndCopy
 * @description Parsea un archivo, encuentra sus dependencias con alias y las copia
 *              recursivamente al directorio de destino.
 * @param {string} sourcePath - La ruta absoluta del archivo a procesar.
 * @param {string} targetRoot - El directorio de destino para la copia.
 * @param {Set<string>} processedFiles - Un set para evitar el procesamiento cíclico.
 * @returns {Promise<void>}
 */
async function resolveAndCopy(
  sourcePath: string,
  targetRoot: string,
  processedFiles: Set<string>
): Promise<void> {
  const normalizedSourcePath = path.normalize(sourcePath);
  if (processedFiles.has(normalizedSourcePath)) {
    return;
  }
  processedFiles.add(normalizedSourcePath);
  logger.trace(
    `[Copier] Procesando: ${path.relative(PROJECT_ROOT, normalizedSourcePath)}`
  );

  try {
    const fileContent = await fs.readFile(normalizedSourcePath, "utf-8");
    const relativePath = path.relative(PROJECT_ROOT, normalizedSourcePath);
    const destinationPath = path.join(targetRoot, relativePath);

    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    await fs.copyFile(normalizedSourcePath, destinationPath);

    // --- [INICIO DE REFACTORIZACIÓN A AST] ---
    const ast = await swc.parse(fileContent, {
      syntax: "typescript",
      tsx: true,
    });

    const dependencies: string[] = [];
    if (ast.type === "Module") {
      for (const node of ast.body) {
        if (
          node.type === "ImportDeclaration" &&
          node.source.value.startsWith("@/")
        ) {
          dependencies.push(node.source.value);
        }
      }
    }
    // --- [FIN DE REFACTORIZACIÓN A AST] ---

    for (const dependencyImportPath of dependencies) {
      const resolvedDependencyPath =
        await resolveImportPath(dependencyImportPath);
      if (resolvedDependencyPath) {
        await resolveAndCopy(
          resolvedDependencyPath,
          targetRoot,
          processedFiles
        );
      } else {
        logger.warn(
          `[Copier] No se pudo resolver la dependencia: ${dependencyImportPath} en ${path.relative(
            PROJECT_ROOT,
            normalizedSourcePath
          )}`
        );
      }
    }
  } catch (error) {
    logger.error(`[Copier] Fallo al procesar ${normalizedSourcePath}`, {
      error,
    });
  }
}

export async function copyComponentDependencies(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.info(
    "[Copier] Iniciando copia de dependencias de componentes v3.0 (AST-Powered)..."
  );
  const processed = new Set<string>();
  const requiredSections = [...new Set(draft.layoutConfig.map((s) => s.name))];

  // Punto de entrada: El SectionRenderer sigue siendo el orquestador principal.
  await resolveAndCopy(
    path.join(SRC_ROOT, "components", "layout", "SectionRenderer.tsx"),
    targetDir,
    processed
  );

  // Copiamos las secciones requeridas y sus dependencias.
  for (const sectionName of requiredSections) {
    if (sectionsConfig[sectionName as keyof typeof sectionsConfig]) {
      const sourcePath = path.join(
        SRC_ROOT,
        "components",
        "sections",
        `${sectionName}.tsx`
      );
      await resolveAndCopy(sourcePath, targetDir, processed);
    }
  }
  logger.success(
    `[Copier] Copia de dependencias completada. Total: ${processed.size} archivos procesados.`
  );
}
