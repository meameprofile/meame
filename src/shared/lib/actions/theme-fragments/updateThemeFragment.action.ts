// RUTA: src/shared/lib/actions/theme-fragments/updateThemeFragment.action.ts
/**
 * @file updateThemeFragment.action.ts
 * @description Server Action de élite para actualizar un fragmento de tema existente.
 * @version 1.0.0
 * @author L.I.A. Legacy (Creative Twin)
 */
"use server";

import "server-only";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { Json } from "@/shared/lib/supabase/database.types";
import {
  type ThemeFragmentUpdate,
  type ThemeFragmentRow,
} from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { ThemeFragment } from "./getThemeFragments.action";

const UpdateFragmentInputSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string().min(1).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

type UpdateFragmentInput = z.infer<typeof UpdateFragmentInputSchema>;

function mapSupabaseToThemeFragment(row: ThemeFragmentRow): ThemeFragment {
  return {
    id: row.id,
    workspace_id: row.workspace_id,
    user_id: row.user_id,
    name: row.name,
    type: row.type,
    data: row.data as Record<string, unknown>,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function updateThemeFragmentAction(
  input: UpdateFragmentInput
): Promise<ActionResult<{ updatedFragment: ThemeFragment }>> {
  const traceId = logger.startTrace("updateThemeFragmentAction_v1.0");
  logger.startGroup(`[Action] Actualizando fragmento de tema...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const validation = UpdateFragmentInputSchema.safeParse(input);
    if (!validation.success)
      return { success: false, error: "Datos de entrada inválidos." };

    const { id, workspaceId, ...updateData } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");

    const supabasePayload: ThemeFragmentUpdate = {
      name: updateData.name,
      data: updateData.data as Json,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedFragmentRow, error } = await supabase
      .from("theme_fragments")
      .update(supabasePayload)
      .match({ id, workspace_id: workspaceId })
      .select()
      .single();

    if (error) throw new Error(`Error de Supabase: ${error.message}`);

    const updatedFragment = mapSupabaseToThemeFragment(updatedFragmentRow);

    logger.success(
      `[Action] Fragmento '${updatedFragment.name}' actualizado con éxito.`
    );
    return { success: true, data: { updatedFragment } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al actualizar fragmento.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo actualizar el estilo." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
