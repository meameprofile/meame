// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateCampaignThemeProvider.ts
/**
 * @file generateCampaignThemeProvider.ts
 * @description Módulo generador soberano para el componente de layout CampaignThemeProvider.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import fs from "fs/promises";
import path from "path";
import { logger } from "@/shared/lib/logging";

/**
 * @function generateCampaignThemeProvider
 * @description Genera el archivo components/layout/CampaignThemeProvider.tsx.
 * @param {string} targetDir - El directorio raíz del proyecto exportado.
 * @returns {Promise<void>}
 */
export async function generateCampaignThemeProvider(
  targetDir: string
): Promise<void> {
  logger.trace(
    "[Generator] Iniciando generación de CampaignThemeProvider.tsx..."
  );

  const componentContent = `
import React from "react";

// Este componente es una versión simplificada, ya que no necesita la lógica
// de ensamblaje de tema que sí se requiere en la SDC.
function generateCssVariablesFromTheme(theme: any): string {
  // Lógica de generación de variables CSS simplificada para el export
  let cssString = ":root {";
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (typeof value === 'string') cssString += \`--\${key}: \${value};\`;
    }
  }
  if (theme.fonts) {
    for (const [key, value] of Object.entries(theme.fonts)) {
      const cssVarName = key.startsWith("--") ? key : \`--font-\${key}\`;
      cssString += \`\${cssVarName}: \${value};\`;
    }
  }
  cssString += "}";
  return cssString;
}

export function CampaignThemeProvider({ theme, children }: { theme: any; children: React.ReactNode }) {
  const styleRule = generateCssVariablesFromTheme(theme);
  return (
    <>
      {styleRule && <style dangerouslySetInnerHTML={{ __html: styleRule }} />}
      {children}
    </>
  );
}
`;

  try {
    const layoutDir = path.join(targetDir, "components", "layout");
    await fs.mkdir(layoutDir, { recursive: true });
    const filePath = path.join(layoutDir, "CampaignThemeProvider.tsx");
    await fs.writeFile(filePath, componentContent.trim());
    logger.trace(
      `[Generator] Archivo CampaignThemeProvider.tsx escrito exitosamente.`
    );
  } catch (error) {
    logger.error(
      "[Generator] Fallo crítico al generar CampaignThemeProvider.tsx.",
      { error }
    );
    throw error;
  }
}
// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateCampaignThemeProvider.ts
