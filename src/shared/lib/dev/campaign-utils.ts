// RUTA: src/shared/lib/dev/campaign-utils.ts
/**
 * @file campaign-utils.ts
 * @description Utilidades del lado del servidor para el Developer Command Center.
 *              Este aparato es EXCLUSIVO DEL SERVIDOR.
 * @version 2.0.0 (Server-Only Enforcement & ACS Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { CampaignMap } from "@/shared/lib/schemas/campaigns/campaign-map.schema";

export interface CampaignVariantInfo {
  campaignId: string;
  variantId: string;
  name: string;
  description: string;
}

const CAMPAIGNS_DIR = path.join(process.cwd(), "content", "campaigns");

export async function getAllCampaignsAndVariants(): Promise<
  CampaignVariantInfo[]
> {
  const traceId = logger.startTrace("getAllCampaignsAndVariants");
  logger.info("[DevUtils] Descubriendo todas las campañas y variantes...");

  const allVariants: CampaignVariantInfo[] = [];
  try {
    const campaignDirs = await fs.readdir(CAMPAIGNS_DIR, {
      withFileTypes: true,
    });
    for (const campaignDir of campaignDirs) {
      if (campaignDir.isDirectory()) {
        const campaignId = campaignDir.name;
        const mapPath = path.join(
          CAMPAIGNS_DIR,
          campaignId,
          "campaign.map.json"
        );
        try {
          const mapContent = await fs.readFile(mapPath, "utf-8");
          const campaignMap: CampaignMap = JSON.parse(mapContent);
          for (const variantId in campaignMap.variants) {
            const variant = campaignMap.variants[variantId];
            allVariants.push({
              campaignId,
              variantId,
              name: `${campaignMap.campaignName} - ${variant.name}`,
              description: variant.description,
            });
          }
        } catch (error) {
          logger.warn(
            `No se pudo leer o parsear el campaign.map.json para la campaña ${campaignId}`,
            { error, traceId }
          );
        }
      }
    }
    logger.success(
      `[DevUtils] Se encontraron ${allVariants.length} variantes de campaña.`,
      { traceId }
    );
    return allVariants;
  } catch (error) {
    logger.error(
      "[DevUtils] Error crítico al escanear el directorio de campañas.",
      { error, traceId }
    );
    return [];
  } finally {
    logger.endTrace(traceId);
  }
}
