// app/[locale]/(dev)/dev/campaign-suite/_actions/getBaseCampaigns.action.ts
/**
 * @file getBaseCampaigns.action.ts
 * @description Server Action dedicada para obtener la lista de campañas base.
 *              v1.1.0 (Holistic Type & Import Fix): Resuelve errores de
 *              resolución de módulo y de seguridad de tipos, garantizando
 *              un tipado explícito y robusto en toda la función.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { logger } from "@/shared/lib/logging";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Se corrige la ruta de importación y se importa el tipo necesario.
import {
  getAllCampaignsAndVariants,
  type CampaignVariantInfo,
} from "@/shared/lib/dev/campaign-utils";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function getBaseCampaignsAction(): Promise<
  ActionResult<string[]>
> {
  try {
    const campaigns = await getAllCampaignsAndVariants();

    // --- [INICIO DE CORRECCIÓN DE TIPO] ---
    // Se añade un tipo explícito al parámetro 'c' y se asegura que el Set
    // sea de tipo string para una correcta inferencia en Array.from.
    const baseCampaigns = Array.from(
      new Set(campaigns.map((c: CampaignVariantInfo) => c.campaignId))
    );
    // --- [FIN DE CORRECCIÓN DE TIPO] ---

    logger.success(
      `[Action] ${baseCampaigns.length} campañas base encontradas.`
    );
    return { success: true, data: baseCampaigns };
  } catch (error) {
    logger.error("Fallo al obtener las campañas base.", { error });
    return {
      success: false,
      error: "No se pudieron cargar las campañas base desde el servidor.",
    };
  }
}
