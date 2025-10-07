// RUTA: src/shared/lib/actions/theme-presets/get-theme-presets.action.ts
/**
 * @file get-theme-presets.action.ts
 * @description Server Action para obtener presets de tema.
 * @version 5.0.0 (Sovereign Shaper & Granular Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { ThemePresetRow } from "@/shared/lib/schemas/theme-presets/theme-presets.contracts";
import { mapSupabaseToThemePreset } from "./_shapers/theme-presets.shapers";

export async function getThemePresetsAction(
  workspaceId: string
): Promise<ActionResult<{ global: ThemePreset[]; workspace: ThemePreset[] }>> {
  const traceId = logger.startTrace("getThemePresetsAction_v5.0");
  logger.startGroup(`[Action] Obteniendo presets de tema...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const { data, error } = await supabase
      .from("theme_presets")
      .select("*")
      .or(`workspace_id.eq.${workspaceId},workspace_id.is.null`)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    const presetsFromDb = (data as ThemePresetRow[]) || [];
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${presetsFromDb.length} presets crudos de la DB.`
    );

    const validPresets: ThemePreset[] = [];
    for (const row of presetsFromDb) {
      try {
        const preset = mapSupabaseToThemePreset(row, traceId);
        validPresets.push(preset);
      } catch (validationError) {
        logger.warn(`[Guardián] Preset corrupto omitido (ID: ${row.id}).`, {
          error:
            validationError instanceof Error
              ? validationError.message
              : "Error de validación",
          traceId,
        });
      }
    }
    logger.traceEvent(
      traceId,
      `Se procesaron ${validPresets.length} presets válidos.`
    );

    const globalPresets = validPresets.filter((p) => p.workspaceId === null);
    const workspacePresets = validPresets.filter(
      (p) => p.workspaceId === workspaceId
    );

    logger.success(
      `[Action] Presets obtenidos: ${globalPresets.length} globales, ${workspacePresets.length} de workspace.`
    );
    return {
      success: true,
      data: { global: globalPresets, workspace: workspacePresets },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al obtener presets.", { error: msg, traceId });
    return { success: false, error: "No se pudieron cargar los presets." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
