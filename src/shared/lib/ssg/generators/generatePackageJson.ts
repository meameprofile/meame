// RUTA: src/shared/lib/ssg/generators/generatePackageJson.ts
/**
 * @file generatePackageJson.ts
 * @description Módulo generador soberano para el archivo package.json.
 *              v3.0.0 (Dependency Symmetry): Refactorizado para leer
 *              dinámicamente las dependencias del proyecto principal,
 *              garantizando la simetría de versiones.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";
import type { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";

type ValidatedDraft = z.infer<typeof CampaignDraftDataSchema>;

const sanitizeForPackageName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE] ---

const DEPENDENCY_WHITELIST = [
  "next",
  "react",
  "react-dom",
  "clsx",
  "framer-motion",
  "lucide-react",
  "tailwind-merge",
  "tailwindcss-animate",
];

const DEV_DEPENDENCY_WHITELIST = [
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "autoprefixer",
  "eslint",
  "eslint-config-next",
  "postcss",
  "tailwindcss",
  "typescript",
];

async function getProjectDependencies(): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}> {
  const mainPackageJsonPath = path.resolve(process.cwd(), "package.json");
  const fileContent = await fs.readFile(mainPackageJsonPath, "utf-8");
  const mainPackageJson = JSON.parse(fileContent);

  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  for (const pkg of DEPENDENCY_WHITELIST) {
    if (mainPackageJson.dependencies[pkg]) {
      dependencies[pkg] = mainPackageJson.dependencies[pkg];
    }
  }

  for (const pkg of DEV_DEPENDENCY_WHITELIST) {
    if (mainPackageJson.devDependencies[pkg]) {
      devDependencies[pkg] = mainPackageJson.devDependencies[pkg];
    }
  }

  return { dependencies, devDependencies };
}

// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export async function generatePackageJson(
  draft: ValidatedDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de package.json (v3.0)...");

  const packageName = sanitizeForPackageName(draft.variantName || "campaign");
  const projectDeps = await getProjectDependencies();

  const packageJsonTemplate = {
    name: packageName,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
    },
    dependencies: projectDeps.dependencies,
    devDependencies: projectDeps.devDependencies,
  };

  const fileContent = JSON.stringify(packageJsonTemplate, null, 2);
  const filePath = path.join(targetDir, "package.json");

  await fs.writeFile(filePath, fileContent);
  logger.trace(
    `[Generator] Archivo package.json simétrico escrito exitosamente.`
  );
}
