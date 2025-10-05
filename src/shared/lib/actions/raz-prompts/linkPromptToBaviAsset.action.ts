// RUTA: src/shared/lib/actions/raz-prompts/linkPromptToBaviAsset.action.ts
/**
 * @file linkPromptToBaviAsset.action.ts
 * @description Server Action simbiótica para vincular un activo de BAVI a un genoma de prompt,
 *              ahora con seguridad de tipos absoluta mediante contratos de dominio soberanos.
 * @version 10.0.0 (Sovereign Contract Aligned)
 * @author RaZ Podestá - MetaShark Tech
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
  const traceId = logger.startTrace("linkPromptToBaviAsset_v10.0");
  logger.startGroup(`[Action] Vinculando prompt ${promptId}...`, traceId);

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

    const updatedBaviAssetIds = Array.from(
      new Set([...(currentPrompt.bavi_asset_ids || []), baviAssetId])
    );

    const updatePayload: RazPromptsEntryUpdate = {
      status: "generated",
      updated_at: new Date().toISOString(),
      bavi_asset_ids: updatedBaviAssetIds,
    };
    logger.traceEvent(
      traceId,
      "Payload de actualización (snake_case) generado."
    );

    const { error: updateError, count } = await supabase
      .from("razprompts_entries")
      .update(updatePayload)
      .eq("id", promptId)
      .eq("workspace_id", workspaceId);

    if (updateError) {
      throw new Error(`Error al actualizar el prompt: ${updateError.message}`);
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
