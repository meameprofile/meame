// RUTA: src/shared/lib/actions/raz-prompts/linkPromptToBaviAsset.action.ts
/**
 * @file linkPromptToBaviAsset.action.ts
 * @description Server Action simbiótica para vincular un activo de BAVI a un genoma de prompt.
 *              Forjada con observabilidad transaccional, resiliencia atómica y un contrato de tipos estricto.
 * @version 9.1.0 (Type Safety & API Contract Restoration)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";

interface LinkPromptInput {
  promptId: string;
  baviAssetId: string;
  workspaceId: string;
}

type SupabaseUpdatePayload = {
  status: "generated";
  updated_at: string;
  bavi_asset_ids: string[];
};

export async function linkPromptToBaviAssetAction({
  promptId,
  baviAssetId,
  workspaceId,
}: LinkPromptInput): Promise<ActionResult<{ updatedCount: number }>> {
  const traceId = logger.startTrace("linkPromptToBaviAsset_v9.1");
  // --- [INICIO DE CORRECCIÓN DE CONTRATO DE API (TS2345)] ---
  // Se elimina el segundo argumento inválido de la llamada a startGroup.
  logger.startGroup(`[Action] Vinculando prompt ${promptId}...`);
  // --- [FIN DE CORRECCIÓN DE CONTRATO DE API] ---

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] Intento no autorizado.", { traceId });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId, min_role: "member" }
    );

    if (memberError || !memberCheck) {
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(
      traceId,
      `Membresía del workspace ${workspaceId} verificada.`
    );

    if (!promptId || !baviAssetId) {
      throw new Error("Faltan IDs esenciales para la vinculación.");
    }
    logger.traceEvent(
      traceId,
      `Vinculando prompt ${promptId} con activo ${baviAssetId}.`
    );

    const { data: currentPrompt, error: fetchError } = await supabase
      .from("razprompts_entries")
      .select("bavi_asset_ids")
      .eq("id", promptId)
      .eq("workspace_id", workspaceId)
      .single();

    if (fetchError) {
      throw new Error(
        `No se encontró el prompt o acceso denegado: ${fetchError.message}`
      );
    }
    logger.traceEvent(traceId, "Prompt actual obtenido de la base de datos.");

    const updatedBaviAssetIds = Array.from(
      new Set([...(currentPrompt.bavi_asset_ids || []), baviAssetId])
    );
    logger.traceEvent(traceId, `Array de IDs de activo actualizado.`);

    const updatePayload: SupabaseUpdatePayload = {
      status: "generated",
      updated_at: new Date().toISOString(),
      bavi_asset_ids: updatedBaviAssetIds,
    };

    const { error: updateError, count } = await supabase
      .from("razprompts_entries")
      .update(updatePayload)
      .eq("id", promptId)
      .eq("workspace_id", workspaceId);

    if (updateError) {
      throw new Error(`Error al actualizar el prompt: ${updateError.message}`);
    }

    if (count === 0) {
      logger.warn(
        `[Action] No se actualizó ninguna fila para el prompt ${promptId}.`,
        { traceId }
      );
    }

    logger.success(
      `[Action] Prompt ${promptId} vinculado con éxito. Filas afectadas: ${
        count ?? 0
      }.`,
      { traceId }
    );
    return { success: true, data: { updatedCount: count ?? 0 } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico en la vinculación.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudo vincular el prompt al activo: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
