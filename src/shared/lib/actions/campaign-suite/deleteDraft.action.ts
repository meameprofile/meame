// RUTA: src/shared/lib/actions/campaign-suite/deleteDraft.action.ts
/**
 * @file deleteDraft.action.ts
 * @description Server Action de producción para eliminar un borrador de campaña.
 *              Forjada con observabilidad de élite y resiliencia.
 * @version 2.1.0 (Elite Observability & Contract Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function deleteDraftAction(
  draftId: string
): Promise<ActionResult<{ deletedCount: number }>> {
  const traceId = logger.startTrace("deleteDraftAction_v2.1");
  const groupId = logger.startGroup(`[Action] Eliminando borrador: ${draftId}`);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] Intento de eliminación no autorizado.", {
        traceId,
      });
      return { success: false, error: "Acción no autorizada." };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const validation = z.string().min(1).safeParse(draftId);
    if (!validation.success) {
      logger.warn("[Action] ID de borrador inválido proporcionado.", {
        draftId,
        traceId,
      });
      return {
        success: false,
        error: "El ID de borrador proporcionado es inválido.",
      };
    }
    const validDraftId = validation.data;
    logger.traceEvent(traceId, `ID de borrador validado: ${validDraftId}`);

    logger.traceEvent(
      traceId,
      "Ejecutando operación de eliminación en Supabase..."
    );
    const { count, error } = await supabase
      .from("campaign_drafts")
      .delete()
      .match({ draft_id: validDraftId, user_id: user.id });

    if (error) {
      throw new Error(error.message);
    }

    logger.success(
      `[Action] Operación de eliminación completada. Filas afectadas: ${count ?? 0}.`,
      { traceId }
    );
    return { success: true, data: { deletedCount: count ?? 0 } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Action] Fallo crítico durante la eliminación del borrador.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return {
      success: false,
      error: "No se pudo completar la eliminación en la base de datos.",
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
