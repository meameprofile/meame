// RUTA: src/shared/lib/ssg/generators/generateLayout.ts
/**
 * @file generateLayout.ts
 * @description Módulo generador soberano para el archivo raíz app/layout.tsx.
 * @version 2.0.0 (Database-Driven Theming)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";

export async function generateLayout(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de app/layout.tsx (v2.0)...");

  try {
    const validation = AssembledThemeSchema.safeParse(draft.themeConfig);
    if (!validation.success) {
      throw new Error(
        `El themeConfig del borrador es inválido: ${validation.error.message}`
      );
    }
    const theme = validation.data;

    // 2. Determinar qué fuentes importar dinámicamente.
    const fontImports: string[] = [];
    const fontVariables: string[] = [];
    const fontClassNames: string[] = [];
    const requiredFonts = new Set<string>();

    if (theme.fonts?.sans) requiredFonts.add(theme.fonts.sans);
    if (theme.fonts?.serif) requiredFonts.add(theme.fonts.serif);

    if (Array.from(requiredFonts).some((f) => f.includes("Inter"))) {
      fontImports.push(`import { Inter } from "next/font/google";`);
      fontVariables.push(
        `const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });`
      );
      fontClassNames.push("${inter.variable}");
    }
    if (Array.from(requiredFonts).some((f) => f.includes("Poppins"))) {
      fontImports.push(`import { Poppins } from "next/font/google";`);
      fontVariables.push(
        `const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });`
      );
      fontClassNames.push("${poppins.variable}");
    }
    // Añadir más lógicas para otras fuentes aquí si es necesario.

    // 3. Construir el contenido del archivo layout.tsx.
    const layoutContent = `
import type { Metadata } from "next";
${fontImports.join("\n")}
import "./globals.css";

${fontVariables.join("\n")}

export const metadata: Metadata = {
  title: "${draft.variantName || "Campaña Generada"}",
  description: "Landing page generada por el Motor de Forja de élite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={\`${fontClassNames.join(" ")}\`}>
      <body>{children}</body>
    </html>
  );
}
`;
    const appDir = path.join(targetDir, "src", "app");
    await fs.mkdir(appDir, { recursive: true });
    const filePath = path.join(appDir, "layout.tsx");
    await fs.writeFile(filePath, layoutContent.trim());

    logger.trace(`[Generator] Archivo layout.tsx escrito exitosamente.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico al generar layout.tsx.", {
      error: errorMessage,
    });
    throw error;
  }
}
