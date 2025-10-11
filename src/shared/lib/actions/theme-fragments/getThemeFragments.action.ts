// RUTA: src/shared/lib/actions/theme-fragments/getThemeFragments.action.ts
/**
 * @file getThemeFragments.action.ts
 * @description Server Action para obtener los fragmentos de tema.
 *              v4.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import type { ThemeFragmentRow } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

import { mapSupabaseToThemeFragment } from "./_shapers/theme-fragments.shapers";

export const ThemeFragmentSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
  name: z.string(),
  type: z.enum(["color", "font", "geometry"]),
  data: z.record(z.string(), z.unknown()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ThemeFragment = z.infer<typeof ThemeFragmentSchema>;

export async function getThemeFragmentsAction(
  workspaceId: string,
  type: "color" | "font" | "geometry"
): Promise<
  ActionResult<{ global: ThemeFragment[]; workspace: ThemeFragment[] }>
> {
  const traceId = logger.startTrace("getThemeFragmentsAction_v4.0");
  const groupId = logger.startGroup(
    `[Action] Obteniendo fragmentos de tema...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data, error } = await supabase
      .from("theme_fragments")
      .select("*")
      .eq("type", type)
      .or(`workspace_id.eq.${workspaceId},workspace_id.is.null`);

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${data.length} fragmentos crudos de la DB.`
    );

    const validFragments: ThemeFragment[] = [];
    for (const row of (data as ThemeFragmentRow[]) || []) {
      try {
        const fragment = mapSupabaseToThemeFragment(row, traceId);
        validFragments.push(fragment);
      } catch (validationError) {
        logger.warn(`[Guardián] Fragmento corrupto omitido (ID: ${row.id}).`, {
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
      `Se procesaron ${validFragments.length} fragmentos válidos.`
    );

    const globalFragments = validFragments.filter(
      (fragment) => fragment.workspace_id === null
    );
    const workspaceFragments = validFragments.filter(
      (fragment) => fragment.workspace_id === workspaceId
    );

    logger.success(`[Action] Fragmentos obtenidos y clasificados con éxito.`, {
      globalCount: globalFragments.length,
      workspaceCount: workspaceFragments.length,
      traceId,
    });

    return {
      success: true,
      data: { global: globalFragments, workspace: workspaceFragments },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[Action] Fallo crítico al obtener fragmentos de tema de tipo '${type}'.`,
      { error: errorMessage, traceId }
    );
    return { success: false, error: "No se pudieron cargar los estilos." };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
