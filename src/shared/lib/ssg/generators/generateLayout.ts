// RUTA: src/shared/lib/ssg/generators/generateLayout.ts
/**
 * @file generateLayout.ts
 * @description Módulo generador soberano para el archivo raíz app/layout.tsx.
 *              v4.0.0 (CampaignDraft v7.0 Contract Alignment): Se alinea con
 *              el nuevo contrato de `CampaignDraft`, usando `campaignName`.
 * @version 4.0.0
 * @author L.I.A. Legacy
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { BuildContext } from "@/shared/lib/ssg/engine/types";

export async function generateLayout(context: BuildContext): Promise<void> {
  logger.trace("[Generator] Iniciando generación de app/layout.tsx (v4.0)...");

  try {
    const { draft, theme } = context;
    const fontImports: string[] = [];
    const fontVariables: string[] = [];
    const fontClassNames: string[] = [];

    // Lógica dinámica para detectar y configurar las fuentes desde el tema.
    if (theme.fonts?.sans?.includes("Inter")) {
      fontImports.push(`import { Inter } from "next/font/google";`);
      fontVariables.push(
        `const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });`
      );
      fontClassNames.push("inter.variable");
    }
    if (theme.fonts?.serif?.includes("Poppins")) {
      fontImports.push(`import { Poppins } from "next/font/google";`);
      fontVariables.push(
        `const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });`
      );
      fontClassNames.push("poppins.variable");
    }

    const layoutContent = `
import type { Metadata } from "next";
import { cn } from "@/lib/utils/cn";
${fontImports.join("\n")}
import "./globals.css";

${fontVariables.join("\n")}

export const metadata: Metadata = {
  title: "${draft.campaignName || "Campaña Generada"}",
  description: "Landing page generada por el Motor de Forja de élite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={cn(${fontClassNames.join(", ")})}>
      <body>{children}</body>
    </html>
  );
}
`;
    const appDir = path.join(context.tempDir, "app");
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
