// RUTA: src/shared/lib/ssg/generators/generatePage.ts
/**
 * @file generatePage.ts
 * @description Módulo generador soberano para el archivo principal app/page.tsx.
 * @version 2.0.0 (Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";

export async function generatePage(targetDir: string): Promise<void> {
  logger.trace("[Generator] Iniciando generación de app/page.tsx...");

  const pageContent = `
import { SectionRenderer } from "@/components/layout/SectionRenderer";
import dictionaryData from "@/content/content.json";
import themeData from "@/content/theme.json";

// Tipos básicos para seguridad en el entorno estático
type Dictionary = Record<string, any>;
type Theme = { layout?: { sections?: { name: string }[] } };

export default async function HomePage() {
  const locale = "it-IT"; // Placeholder para el locale principal
  const dictionary: Dictionary = (dictionaryData as any)[locale] || {};
  const theme: Theme = themeData || {};

  if (!theme.layout?.sections) {
    return (
      <div>Error de Configuración: Layout no encontrado.</div>
    );
  }

  return (
      <SectionRenderer
        sections={theme.layout.sections}
        dictionary={dictionary}
        locale={locale}
      />
  );
}
`;

  try {
    const appDir = path.join(targetDir, "src", "app");
    await fs.mkdir(appDir, { recursive: true });
    const filePath = path.join(appDir, "page.tsx");
    await fs.writeFile(filePath, pageContent.trim());
    logger.trace(`[Generator] Archivo page.tsx escrito exitosamente.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico al generar page.tsx.", {
      error: errorMessage,
    });
    throw error;
  }
}
