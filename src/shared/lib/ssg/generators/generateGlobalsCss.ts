// RUTA: src/shared/lib/ssg/generators/generateGlobalsCss.ts
/**
 * @file generateGlobalsCss.ts
 * @description Módulo generador soberano para el archivo app/globals.css.
 *              v2.0.0 (DRY Principle): Refactorizado para ser un generador puro que
 *              consume el tema ensamblado desde el BuildContext.
 * @version 2.0.0
 * @author L.I.A. Legacy
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";
import type { BuildContext } from "@/shared/lib/ssg/engine/types";

export async function generateGlobalsCss(context: BuildContext): Promise<void> {
  logger.trace(
    "[Generator] Iniciando generación de app/globals.css (v2.0 - DRY)..."
  );

  try {
    // La lógica de ensamblaje fue eliminada. El tema se consume directamente del contexto.
    const cssVariables = generateCssVariablesFromTheme(context.theme);

    const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ${cssVariables}

  body {
    @apply bg-background text-foreground;
  }
}
`;
    const appDir = path.join(context.tempDir, "app");
    await fs.mkdir(appDir, { recursive: true });
    const filePath = path.join(appDir, "globals.css");
    await fs.writeFile(filePath, cssContent.trim());

    logger.trace(`[Generator] Archivo globals.css escrito exitosamente.`);
  } catch (error) {
    logger.error("[Generator] Fallo crítico al generar globals.css.", {
      error,
    });
    throw error;
  }
}
