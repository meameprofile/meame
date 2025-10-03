// RUTA: src/shared/lib/actions/theme-presets/get-theme-presets.action.ts
/**
 * @file get-theme-presets.action.ts
 * @description Server Action para obtener los presets de tema.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";

export async function getThemePresetsAction(
  workspaceId: string
): Promise<ActionResult<{ global: ThemePreset[]; workspace: ThemePreset[] }>> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "auth_required" };

  try {
    const { data, error } = await supabase
      .from("theme_presets")
      .select("*")
      .or(`workspace_id.eq.${workspaceId},workspace_id.is.null`)
      .order("name", { ascending: true });

    if (error) throw error;

    const globalPresets = data.filter((p) => p.workspace_id === null);
    const workspacePresets = data.filter((p) => p.workspace_id === workspaceId);

    return {
      success: true,
      data: { global: globalPresets, workspace: workspacePresets },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo al obtener presets de tema", { error: msg });
    return { success: false, error: "No se pudieron cargar los presets." };
  }
}
