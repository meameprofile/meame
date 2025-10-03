// RUTA: src/shared/lib/actions/campaign-suite/saveDraft.action.ts
/**
 * @file saveDraft.action.ts
 * @description Server Action de producción para guardar/actualizar un borrador.
 *              v3.1.0 (Code Hygiene Restoration): Se elimina la importación de
 *              tipos no utilizada para cumplir con los estándares de élite.
 * @version 3.1.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  CampaignDraftDataSchema,
  // --- [INICIO DE REFACTORIZACIÓN DE HIGIENE] ---
  // type CampaignDraftDb, // <-- Eliminado: Tipo no utilizado.
  // --- [FIN DE REFACTORIZACIÓN DE HIGIENE] ---
} from "@/shared/lib/schemas/campaigns/draft.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import { z } from "zod";

type SaveDraftInput = z.infer<typeof CampaignDraftDataSchema> & {
  workspaceId: string;
};

export async function saveDraftAction(
  draftData: SaveDraftInput
): Promise<ActionResult<{ draftId: string; updatedAt: string }>> {
  const traceId = logger.startTrace("saveDraftAction_v3.1_hygiene");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Acción no autorizada." };
  }

  try {
    const { workspaceId, ...restOfDraft } = draftData;
    const validation = CampaignDraftDataSchema.safeParse(restOfDraft);
    if (!validation.success) {
      return {
        success: false,
        error: "Los datos del borrador son inválidos.",
      };
    }

    const { error } = await supabase.from("campaign_drafts").upsert({
      draft_id: validation.data.draftId,
      user_id: user.id,
      workspace_id: workspaceId,
      draft_data: validation.data,
    });

    if (error) throw new Error(error.message);

    const now = new Date().toISOString();
    revalidatePath("/creator/campaign-suite");

    return {
      success: true,
      data: { draftId: draftData.draftId!, updatedAt: now },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    return {
      success: false,
      error: `No se pudo guardar el borrador: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
