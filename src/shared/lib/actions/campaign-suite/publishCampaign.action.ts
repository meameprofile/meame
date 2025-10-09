// RUTA: src/shared/lib/actions/campaign-suite/publishCampaign.action.ts
/**
 * @file publishCampaign.action.ts
 * @description Server Action orquestadora para publicar los activos de una campaña.
 *              v8.0.0 (CampaignDraft v7.0 Contract Alignment): Se alinea la
 *              acción con el nuevo contrato de datos de CampaignDraft, usando
 *              `campaignName` y `seoKeywords` como un array.
 * @version 8.0.0
 * @author L.I.A. Legacy
 */
"use server-only";

import path from "path";
import { promises as fs } from "fs";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import {
  getOrCreateNextVariantId,
  updateCampaignMap,
  generateCampaignFileNames,
} from "@/shared/lib/utils/campaign-suite/campaignMapManager";
import { deepMerge } from "@/shared/lib/utils";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import type { CampaignMap } from "@/shared/lib/schemas/campaigns/campaign-map.schema";

interface PublishSuccessPayload {
  message: string;
  variantId: string;
}

async function generateAndWriteCampaignAssets(
  draft: CampaignDraft,
  campaignMap: CampaignMap,
  newVariantId: string,
  productionCampaignDir: string
) {
  const { themeFileName, contentFileName } = generateCampaignFileNames(
    draft,
    newVariantId
  );

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
  logger.success("[AssetGenerator Logic] Archivos .json generados con éxito.");

  const updatedMap = { ...campaignMap };
  updatedMap.variants[newVariantId] = {
    name: draft.campaignName || `Variante ${newVariantId}`,
    description: `Variante generada el ${new Date().toISOString()}`,
    content: `./content/${contentFileName}`,
    theme: `${draft.themeConfig.colorPreset}.${draft.themeConfig.fontPreset}.${draft.themeConfig.radiusPreset}`,
    variantSlug:
      draft.campaignName?.toLowerCase().replace(/\s+/g, "-") ||
      `variant-${newVariantId}`,
    seoKeywordSlug: draft.seoKeywords.join("-") || "default-keywords",
    themeOverrides: draft.themeConfig.themeOverrides,
  };
  return {
    updatedMap,
    mapPath: path.join(productionCampaignDir, "campaign.map.json"),
  };
}

export async function publishCampaignAction(
  draft: CampaignDraft
): Promise<ActionResult<PublishSuccessPayload>> {
  const { baseCampaignId, draftId } = draft;
  const traceId = logger.startTrace(`publishCampaign:${draftId}`);
  const groupId = logger.startGroup(
    `[Action] Publicando activos para draft: ${draftId}`
  );

  try {
    const validation = CampaignDraftDataSchema.safeParse(draft);
    if (!validation.success || !baseCampaignId) {
      logger.error("[publishCampaignAction] Borrador inválido o sin ID base.", {
        draftId,
        errors: validation.success === false && validation.error.flatten(),
      });
      return {
        success: false,
        error: "Faltan datos fundamentales del borrador.",
      };
    }

    const productionCampaignDir = path.join(
      process.cwd(),
      "content",
      "campaigns",
      baseCampaignId
    );

    const { nextVariantId, campaignMap } = await getOrCreateNextVariantId(
      productionCampaignDir
    );
    logger.traceEvent(traceId, "Próximo ID de variante obtenido.", {
      nextVariantId,
    });

    const { updatedMap, mapPath } = await generateAndWriteCampaignAssets(
      draft,
      campaignMap,
      nextVariantId,
      productionCampaignDir
    );
    logger.traceEvent(
      traceId,
      "Archivos de activos generados en el directorio de producción."
    );

    await updateCampaignMap(updatedMap, mapPath);
    logger.traceEvent(
      traceId,
      "Mapa de campaña de producción actualizado en disco."
    );

    return {
      success: true,
      data: {
        message: "¡Activos publicados con éxito!",
        variantId: nextVariantId,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico durante la publicación de activos.", {
      error: errorMessage,
      draftId,
    });
    return {
      success: false,
      error: `No se pudo publicar la campaña: ${errorMessage}`,
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
