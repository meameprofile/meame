// RUTA: src/shared/lib/actions/campaign-suite/publishCampaign.action.ts
/**
 * @file publishCampaign.action.ts
 * @description Server Action orquestadora para publicar los activos de una campaña.
 * @version 7.2.0 (Observability Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import path from "path";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import {
  getOrCreateNextVariantId,
  updateCampaignMap,
} from "@/shared/lib/utils/campaign-suite/campaignMapManager";
import { generateCampaignAssets } from "@/shared/lib/utils/campaign-suite/assetGenerator";

interface PublishSuccessPayload {
  message: string;
  variantId: string;
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

    const { updatedMap, mapPath } = await generateCampaignAssets(
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
