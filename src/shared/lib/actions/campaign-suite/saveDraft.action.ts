// RUTA: src/shared/lib/actions/campaign-suite/saveDraft.action.ts
/**
 * @file saveDraft.action.ts
 * @description Server Action de producción para guardar/actualizar un borrador.
 *              v5.0.0 (Decoupled API Contract): Refactorizado para aceptar
 *              el workspaceId como un argumento separado, mejorando la claridad
 *              y la seguridad de tipos.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/lib/supabase/server";
import { CampaignDraftDataSchema } from "@/shared/lib/schemas/campaigns/draft.schema";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import type { Json } from "@/shared/lib/supabase/database.types";
import type { CampaignDraftInsert } from "@/shared/lib/schemas/campaigns/campaign-suite.contracts";

export async function saveDraftAction(
  draftData: CampaignDraft,
  workspaceId: string
): Promise<ActionResult<{ draftId: string; updatedAt: string }>> {
  const traceId = logger.startTrace("saveDraftAction_v5.0");
  logger.startGroup(`[Action] Guardando borrador: ${draftData.draftId}`);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] Intento de guardado no autorizado.", { traceId });
      return { success: false, error: "Acción no autorizada." };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const validation = CampaignDraftDataSchema.safeParse(draftData);
    if (!validation.success) {
      logger.error("[Action] Los datos del borrador son inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      return { success: false, error: "Los datos del borrador son inválidos." };
    }
    const validatedData = validation.data;
    logger.traceEvent(traceId, "Datos del borrador validados con Zod.");

    if (!validatedData.draftId) {
      return { success: false, error: "El ID del borrador es inválido." };
    }

    const supabasePayload: CampaignDraftInsert = {
      draft_id: validatedData.draftId,
      user_id: user.id,
      workspace_id: workspaceId,
      draft_data: validatedData as Json,
    };

    const { error } = await supabase
      .from("campaign_drafts")
      .upsert(supabasePayload);

    if (error) {
      throw new Error(error.message);
    }
    logger.traceEvent(traceId, "Operación 'upsert' en DB completada.");

    const now = new Date().toISOString();
    revalidatePath("/creator/campaign-suite");

    logger.success(
      `[Action] Borrador ${validatedData.draftId} guardado con éxito.`,
      { traceId }
    );
    return {
      success: true,
      data: { draftId: validatedData.draftId, updatedAt: now },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al guardar el borrador.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudo guardar el borrador: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
