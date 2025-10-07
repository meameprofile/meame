// RUTA: src/shared/lib/actions/theme-presets/create-theme-preset.action.ts
/**
 * @file create-theme-preset.action.ts
 * @description Server Action para crear un nuevo preset de tema.
 *              v6.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 6.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type {
  ThemePresetInsert,
  ThemePresetRow,
} from "@/shared/lib/schemas/theme-presets/theme-presets.contracts";
import { mapSupabaseToThemePreset } from "./_shapers/theme-presets.shapers";

interface CreatePresetInput {
  workspaceId: string;
  name: string;
  description?: string;
  type: "color" | "font" | "geometry";
  themeConfig: ThemeConfig;
}

export async function createThemePresetAction(
  input: CreatePresetInput
): Promise<ActionResult<{ newPreset: ThemePreset }>> {
  const traceId = logger.startTrace("createThemePresetAction_v6.0");
  const groupId = logger.startGroup(
    `[Action] Creando preset de tema...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: input.workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");
    logger.traceEvent(traceId, `Membresía del workspace verificada.`);

    const supabasePayload: ThemePresetInsert = {
      workspace_id: input.workspaceId,
      user_id: user.id,
      name: input.name,
      description: input.description,
      type: input.type,
      theme_config: input.themeConfig,
    };

    const { data: newPresetRow, error } = await supabase
      .from("theme_presets")
      .insert(supabasePayload)
      .select()
      .single();
    if (error) throw error;
    logger.traceEvent(traceId, `Preset insertado en DB.`);

    const newPreset = mapSupabaseToThemePreset(
      newPresetRow as ThemePresetRow,
      traceId
    );

    logger.success(
      `[Action] Preset '${newPreset.name}' creado con ID: ${newPreset.id}`
    );
    return { success: true, data: { newPreset } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al crear el preset de tema.", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo guardar el preset." };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
