// Ruta correcta: src/shared/lib/utils/campaign-suite/assetGenerator.ts
/**
 * @file assetGenerator.ts
 * @description Generador de activos soberano para la SDC. Transforma un borrador de
 *              campaña en los artefactos físicos (.json) que serán consumidos por el
 *              motor de renderizado.
 * @version 2.0.0 (Holistic & Functional Reconstruction)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "../../types/campaigns/draft.types";
import type { CampaignMap } from "../../schemas/campaigns/campaign-map.schema";
import { deepMerge } from "@/shared/lib/utils/merge";
import { generateCampaignFileNames } from "./campaignMapManager";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";

/**
 * @function generateCampaignAssets
 * @description Orquesta la creación de los archivos _THEME_.json y _CONTENT_.json.
 * @param draft El borrador de la campaña.
 * @param campaignMap El mapa de campaña actual.
 * @param newVariantId El nuevo ID de variante a asignar.
 * @param productionCampaignDir El directorio de destino para los activos.
 * @returns La estructura de datos actualizada para el mapa de campaña.
 */
export async function generateCampaignAssets(
  draft: CampaignDraft,
  campaignMap: CampaignMap,
  newVariantId: string,
  productionCampaignDir: string
): Promise<{ updatedMap: CampaignMap; mapPath: string }> {
  logger.trace(
    "[AssetGenerator] Iniciando generación de activos para la variante...",
    { variantName: draft.variantName }
  );

  // 1. Generar nombres de archivo estandarizados
  const { themeFileName, contentFileName } = generateCampaignFileNames(
    draft,
    newVariantId
  );

  // 2. Ensamblar y validar el objeto de tema
  const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
    draft.themeConfig;
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

  const finalThemeObject = deepMerge(
    deepMerge(deepMerge(deepMerge(base, colors), fonts), radii),
    themeOverrides ?? {}
  );
  finalThemeObject.layout = { sections: draft.layoutConfig };

  const themeValidation = AssembledThemeSchema.safeParse(finalThemeObject);
  if (!themeValidation.success) {
    throw new Error(
      `El tema ensamblado es inválido: ${themeValidation.error.message}`
    );
  }

  // 3. Escribir los archivos JSON
  const themesDir = path.join(productionCampaignDir, "themes");
  const contentDir = path.join(productionCampaignDir, "content");
  await fs.mkdir(themesDir, { recursive: true });
  await fs.mkdir(contentDir, { recursive: true });

  await fs.writeFile(
    path.join(themesDir, themeFileName),
    JSON.stringify(themeValidation.data, null, 2)
  );
  await fs.writeFile(
    path.join(contentDir, contentFileName),
    JSON.stringify(draft.contentData, null, 2)
  );
  logger.success("[AssetGenerator] Archivos .json generados con éxito.");

  // 4. Actualizar el objeto del mapa de campaña en memoria
  const updatedMap = { ...campaignMap };
  updatedMap.variants[newVariantId] = {
    name: draft.variantName || `Variante ${newVariantId}`,
    description: `Variante generada el ${new Date().toISOString()}`,
    content: `./content/${contentFileName}`,
    theme: `${draft.themeConfig.colorPreset}.${draft.themeConfig.fontPreset}.${draft.themeConfig.radiusPreset}`,
    variantSlug: draft.variantName
      ? draft.variantName.toLowerCase().replace(/\s+/g, "-")
      : `variant-${newVariantId}`,
    seoKeywordSlug: draft.seoKeywords
      ? draft.seoKeywords.toLowerCase().replace(/,?\s+/g, "-")
      : "default-keywords",
    themeOverrides: draft.themeConfig.themeOverrides,
  };

  const mapPath = path.join(productionCampaignDir, "campaign.map.json");

  return { updatedMap, mapPath };
}
// Ruta correcta: src/shared/lib/utils/campaign-suite/assetGenerator.ts
