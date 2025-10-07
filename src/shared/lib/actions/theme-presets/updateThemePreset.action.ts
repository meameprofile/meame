// RUTA: src/shared/lib/actions/theme-presets/updateThemePreset.action.ts
/**
 * @file updateThemePreset.action.ts
 * @description Server Action de élite para actualizar un preset de tema.
 *              v4.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { Json } from "@/shared/lib/supabase/database.types";
import {
  type ThemePresetUpdate,
  type ThemePresetRow,
} from "@/shared/lib/schemas/theme-presets/theme-presets.contracts";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import { mapSupabaseToThemePreset } from "./_shapers/theme-presets.shapers";

const UpdatePresetInputSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  themeConfig: z.any().optional(),
});

type UpdatePresetInput = z.infer<typeof UpdatePresetInputSchema>;

export async function updateThemePresetAction(
  input: UpdatePresetInput
): Promise<ActionResult<{ updatedPreset: ThemePreset }>> {
  const traceId = logger.startTrace("updateThemePresetAction_v4.0");
  const groupId = logger.startGroup(
    `[Action] Actualizando preset de tema...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const validation = UpdatePresetInputSchema.safeParse(input);
    if (!validation.success)
      return { success: false, error: "Datos de entrada inválidos." };

    const { id, workspaceId, ...updateData } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");

    const supabasePayload: ThemePresetUpdate = {
      ...updateData,
      theme_config: updateData.themeConfig as Json,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedPresetRow, error } = await supabase
      .from("theme_presets")
      .update(supabasePayload)
      .match({ id, workspace_id: workspaceId })
      .select()
      .single();
    if (error) throw new Error(`Error de Supabase: ${error.message}`);

    const updatedPreset = mapSupabaseToThemePreset(
      updatedPresetRow as ThemePresetRow,
      traceId
    );

    logger.success(`[Action] Preset '${updatedPreset.name}' actualizado.`);
    return { success: true, data: { updatedPreset } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al actualizar el preset.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo actualizar el preset." };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
