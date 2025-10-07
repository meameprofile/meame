// RUTA: src/shared/lib/actions/theme-fragments/deleteThemeFragment.action.ts
/**
 * @file deleteThemeFragment.action.ts
 * @description Server Action de élite para eliminar un fragmento de tema.
 *              v3.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const DeleteFragmentInputSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
});

type DeleteFragmentInput = z.infer<typeof DeleteFragmentInputSchema>;

export async function deleteThemeFragmentAction(
  input: DeleteFragmentInput
): Promise<ActionResult<{ deletedId: string }>> {
  const traceId = logger.startTrace("deleteThemeFragmentAction_v3.0");
  const groupId = logger.startGroup(
    `[Action] Eliminando fragmento de tema...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const validation = DeleteFragmentInputSchema.safeParse(input);
    if (!validation.success) {
      logger.warn("[Action] Datos de entrada inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      return { success: false, error: "Datos de entrada inválidos." };
    }
    logger.traceEvent(traceId, `Datos de entrada validados.`);
    const { id, workspaceId } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");
    logger.traceEvent(traceId, `Membresía del workspace verificada.`);

    const { error, count } = await supabase
      .from("theme_fragments")
      .delete()
      .match({ id, workspace_id: workspaceId });

    if (error) throw new Error(`Error de Supabase: ${error.message}`);
    if (count === 0)
      throw new Error(
        "El fragmento no fue encontrado o no tienes permiso para eliminarlo."
      );
    logger.traceEvent(
      traceId,
      `Operación de eliminación en DB completada. Filas afectadas: ${count}`
    );

    logger.success(`[Action] Fragmento con ID '${id}' eliminado con éxito.`);
    return { success: true, data: { deletedId: id } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al eliminar fragmento.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo eliminar el estilo." };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
