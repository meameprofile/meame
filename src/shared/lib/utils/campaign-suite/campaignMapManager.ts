// RUTA: src/shared/lib/utils/campaign-suite/campaignMapManager.ts
/**
 * @file campaignMapManager.ts
 * @description Utilidad para gestionar la lectura y escritura del campaign.map.json.
 * @version 3.0.0 (CampaignDraft v7.0 Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";
import {
  CampaignMapSchema,
  type CampaignMap,
} from "@/shared/lib/schemas/campaigns/campaign-map.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export interface CampaignVariantFileNames {
  themeFileName: string;
  contentFileName: string;
}

export async function getOrCreateNextVariantId(
  campaignDir: string
): Promise<{ nextVariantId: string; campaignMap: CampaignMap }> {
  const mapPath = path.join(campaignDir, "campaign.map.json");
  let campaignMap: CampaignMap;

  try {
    const mapContent = await fs.readFile(mapPath, "utf-8");
    campaignMap = CampaignMapSchema.parse(JSON.parse(mapContent));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      logger.warn(
        "[MapManager] 'campaign.map.json' no encontrado. Se creará uno nuevo en memoria."
      );
      const baseCampaignId = path.basename(campaignDir);
      campaignMap = {
        productId: baseCampaignId,
        campaignName: `Campaña ${baseCampaignId}`,
        description: "Manifiesto de Mapeo autogenerado.",
        variants: {},
      };
    } else {
      logger.error(
        "[MapManager] No se pudo leer o parsear el 'campaign.map.json'.",
        { error }
      );
      throw new Error(
        "El archivo 'campaign.map.json' está corrupto o es inaccesible."
      );
    }
  }

  const existingIds = Object.keys(campaignMap.variants).map((id) =>
    parseInt(id, 10)
  );
  const nextVariantId = (Math.max(0, ...existingIds) + 1)
    .toString()
    .padStart(2, "0");

  logger.trace(
    `[MapManager] Próximo ID de variante determinado: ${nextVariantId}`
  );
  return { nextVariantId, campaignMap };
}

export function generateCampaignFileNames(
  draft: CampaignDraft,
  newVariantId: string
): CampaignVariantFileNames {
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  const { baseCampaignId, campaignName } = draft;
  if (!baseCampaignId || !campaignName || !draft.themeConfig) {
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
    throw new Error(
      "[MapManager] Datos del borrador incompletos para generar nombres de archivo."
    );
  }
  const dateStamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  const safeVariantName = campaignName.replace(/\s+/g, "_");
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  const themeFileName = `${baseCampaignId}_${dateStamp}_THEME_${newVariantId}_${safeVariantName}.json`;
  const contentFileName = `${baseCampaignId}_${dateStamp}_CONTENT_${newVariantId}_${safeVariantName}.json`;
  return { themeFileName, contentFileName };
}

export async function updateCampaignMap(
  campaignMap: CampaignMap,
  mapPath: string
): Promise<void> {
  await fs.writeFile(mapPath, JSON.stringify(campaignMap, null, 2));
  logger.success(
    `[MapManager] '${path.basename(mapPath)}' actualizado con éxito.`
  );
}
