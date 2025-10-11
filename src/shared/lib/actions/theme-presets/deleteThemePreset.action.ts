// RUTA: src/shared/lib/actions/theme-presets/deleteThemePreset.action.ts
/**
 * @file deleteThemePreset.action.ts
 * @description Server Action de élite para eliminar un preset de tema.
 *              v3.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const DeletePresetInputSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
});

type DeletePresetInput = z.infer<typeof DeletePresetInputSchema>;

export async function deleteThemePresetAction(
  input: DeletePresetInput
): Promise<ActionResult<{ deletedId: string }>> {
  const traceId = logger.startTrace("deleteThemePresetAction_v3.0");
  const groupId = logger.startGroup(
    `[Action] Eliminando preset de tema...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const validation = DeletePresetInputSchema.safeParse(input);
    if (!validation.success)
      return { success: false, error: "Datos de entrada inválidos." };

    const { id, workspaceId } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");
    logger.traceEvent(traceId, `Membresía del workspace verificada.`);

    const { error, count } = await supabase
      .from("theme_presets")
      .delete()
      .match({ id, workspace_id: workspaceId });

    if (error) throw new Error(`Error de Supabase: ${error.message}`);
    if (count === 0)
      throw new Error(
        "El preset no fue encontrado o no tienes permiso para eliminarlo."
      );

    logger.success(`[Action] Preset con ID '${id}' eliminado con éxito.`);
    return { success: true, data: { deletedId: id } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al eliminar el preset.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo eliminar el preset." };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
