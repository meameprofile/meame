// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateGlobalsCss.ts
/**
 * @file generateGlobalsCss.ts
 * @description Módulo generador soberano para el archivo app/globals.css.
 *              Es dinámico: ensambla el tema desde los fragmentos y el borrador.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import fs from "fs/promises";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import { deepMerge } from "@/shared/lib/utils";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";

/**
 * @function generateGlobalsCss
 * @description Ensambla el tema y genera un archivo globals.css con las variables CSS.
 * @param {CampaignDraft} draft - El borrador de la campaña.
 * @param {string} targetDir - El directorio raíz del proyecto exportado.
 * @returns {Promise<void>}
 */
export async function generateGlobalsCss(
  draft: CampaignDraft,
  targetDir: string
): Promise<void> {
  logger.trace("[Generator] Iniciando generación de app/globals.css...");

  try {
    const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
      draft.themeConfig;

    // 1. Cargar fragmentos base y seleccionados
    const [base, colors, fonts, radii] = await Promise.all([
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "base",
        "global.theme.json"
      ),
      colorPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "colors",
            `${colorPreset}.colors.json`
          )
        : Promise.resolve({}),
      fontPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "fonts",
            `${fontPreset}.fonts.json`
          )
        : Promise.resolve({}),
      radiusPreset
        ? loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "radii",
            `${radiusPreset}.radii.json`
          )
        : Promise.resolve({}),
    ]);

    // 2. Ensamblar el tema final
    const finalThemeObject = deepMerge(
      deepMerge(deepMerge(deepMerge(base, colors), fonts), radii),
      themeOverrides ?? {}
    );

    const validation = AssembledThemeSchema.safeParse(finalThemeObject);
    if (!validation.success) {
      throw new Error(
        `El tema ensamblado es inválido: ${validation.error.message}`
      );
    }
    const finalTheme = validation.data;
    logger.trace("[Generator] Tema ensamblado y validado con éxito.");

    // 3. Generar la cadena de variables CSS
    const cssVariables = generateCssVariablesFromTheme(finalTheme);

    // 4. Construir el contenido del archivo CSS final
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

    const appDir = path.join(targetDir, "app");
    await fs.mkdir(appDir, { recursive: true });
    const filePath = path.join(appDir, "globals.css");
    await fs.writeFile(filePath, cssContent.trim());

    logger.trace(
      `[Generator] Archivo globals.css escrito exitosamente en: ${filePath}`
    );
  } catch (error) {
    logger.error("[Generator] Fallo crítico al generar globals.css.", {
      error,
    });
    // Propaga el error para que la acción orquestadora lo maneje
    throw error;
  }
}
// app/[locale]/(dev)/dev/campaign-suite/_actions/_generators/generateGlobalsCss.ts
