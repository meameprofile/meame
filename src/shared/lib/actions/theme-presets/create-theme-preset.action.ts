// RUTA: src/shared/lib/actions/theme-presets/create-theme-preset.action.ts
/**
 * @file create-theme-preset.action.ts
 * @description Server Action para crear un nuevo preset de tema.
 * @version 4.0.0 (Holistic Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  ThemePresetSchema,
  type ThemePreset,
} from "@/shared/lib/schemas/theme-preset.schema";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type {
  ThemePresetInsert,
  ThemePresetRow,
} from "@/shared/lib/schemas/theme-presets/theme-presets.contracts";

interface CreatePresetInput {
  workspaceId: string;
  name: string;
  description?: string;
  type: "color" | "font" | "geometry";
  themeConfig: ThemeConfig;
}

function mapSupabaseToThemePreset(row: ThemePresetRow): ThemePreset {
  const transformed = {
    id: row.id,
    workspaceId: row.workspace_id,
    userId: row.user_id,
    name: row.name,
    description: row.description || undefined,
    type: row.type,
    themeConfig: row.theme_config as ThemeConfig,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  return ThemePresetSchema.parse(transformed);
}

export async function createThemePresetAction(
  input: CreatePresetInput
): Promise<ActionResult<{ newPreset: ThemePreset }>> {
  const traceId = logger.startTrace("createThemePresetAction_v4.0");
  logger.startGroup(`[Action] Creando preset de tema...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: input.workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");

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

    const newPreset = mapSupabaseToThemePreset(newPresetRow);
    logger.success(
      `[Action] Preset '${newPreset.name}' creado con ID: ${newPreset.id}`
    );

    return { success: true, data: { newPreset } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al crear el preset de tema", {
      error: msg,
      traceId,
    });
    return { success: false, error: "No se pudo guardar el preset." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
