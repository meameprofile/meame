// RUTA: src/shared/lib/actions/raz-prompts/linkPromptToBaviAsset.action.ts
/**
 * @file linkPromptToBaviAsset.action.ts
 * @description Server Action simbiótica para vincular un activo de BAVI a un genoma de prompt.
 * @version 11.0.0 (Elite Observability & Atomic Update)
 * @author L.I.A. Legacy
 */
"use server";

import "server-only";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import type { RazPromptsEntryUpdate } from "@/shared/lib/schemas/raz-prompts/raz-prompts.contracts";

interface LinkPromptInput {
  promptId: string;
  baviAssetId: string;
  workspaceId: string;
}

export async function linkPromptToBaviAssetAction({
  promptId,
  baviAssetId,
  workspaceId,
}: LinkPromptInput): Promise<ActionResult<{ updatedCount: number }>> {
  const traceId = logger.startTrace("linkPromptToBaviAsset_v11.0");
  logger.startGroup(`[Action] Vinculando prompt ${promptId}...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");

    const { data: currentPrompt, error: fetchError } = await supabase
      .from("razprompts_entries")
      .select("bavi_asset_ids")
      .eq("id", promptId)
      .eq("workspace_id", workspaceId)
      .single();
    if (fetchError)
      throw new Error(`Prompt no encontrado: ${fetchError.message}`);

    const updatedBaviAssetIds = Array.from(
      new Set([...(currentPrompt.bavi_asset_ids || []), baviAssetId])
    );

    const updatePayload: RazPromptsEntryUpdate = {
      status: "generated",
      updated_at: new Date().toISOString(),
      bavi_asset_ids: updatedBaviAssetIds,
    };

    const { error: updateError, count } = await supabase
      .from("razprompts_entries")
      .update(updatePayload)
      .match({ id: promptId, workspace_id: workspaceId });

    if (updateError) throw new Error(updateError.message);

    logger.success(
      `[Action] Prompt ${promptId} vinculado. Filas afectadas: ${count ?? 0}.`
    );
    return { success: true, data: { updatedCount: count ?? 0 } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico en la vinculación.", {
      error: msg,
      traceId,
    });
    return { success: false, error: `No se pudo vincular el prompt: ${msg}` };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
