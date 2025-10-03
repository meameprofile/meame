// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateSectionRenderer.ts
/**
 * @file generateSectionRenderer.ts
 * @description Módulo generador soberano para el motor de renderizado de secciones.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import fs from "fs/promises";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

/**
 * @function generateSectionRenderer
 * @description Genera el archivo components/layout/SectionRenderer.tsx.
 * @param {CampaignDraft} draft - El borrador de la campaña.
 * @param {string} targetDir - El directorio raíz del proyecto exportado.
 * @returns {Promise<void>}
 */
export async function generateSectionRenderer(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de SectionRenderer.tsx...");

  // 1. Obtener una lista única de los nombres de componentes de sección necesarios.
  const requiredSections = [...new Set(draft.layoutConfig.map((s) => s.name))];

  // 2. Generar las declaraciones de importación dinámicamente.
  const importStatements = requiredSections
    .map((name) => `import { ${name} } from "@/components/sections/${name}";`)
    .join("\n");

  // 3. Generar el objeto de configuración de secciones dinámicamente.
  const sectionsConfigObject = `
const sectionsConfig = {
  ${requiredSections
    .map(
      (name) =>
        `${name}: { component: ${name}, dictionaryKey: "${
          name.charAt(0).toLowerCase() + name.slice(1)
        }" }`
    )
    .join(",\n  ")}
};
`;

  // 4. Construir el contenido del componente final.
  const componentContent = `
"use client"; // Necesario para SectionAnimator (framer-motion)

import React from "react";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
${importStatements}

${sectionsConfigObject}

export function SectionRenderer({ sections, dictionary, locale }) {
  return (
    <SectionAnimator>
      {sections.map((section, index) => {
        const config = sectionsConfig[section.name];
        if (!config) return null;

        const Component = config.component;
        const contentData = dictionary[config.dictionaryKey];

        return <Component key={index} content={contentData} locale={locale} />;
      })}
    </SectionAnimator>
  );
}
`;

  try {
    const layoutDir = path.join(targetDir, "components", "layout");
    await fs.mkdir(layoutDir, { recursive: true });
    const filePath = path.join(layoutDir, "SectionRenderer.tsx");
    await fs.writeFile(filePath, componentContent.trim());
    logger.trace(
      `[Generator] Archivo SectionRenderer.tsx escrito exitosamente.`
    );
  } catch (error) {
    logger.error("[Generator] Fallo crítico al generar SectionRenderer.tsx.", {
      error,
    });
    throw error;
  }
}
// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateSectionRenderer.ts
