// RUTA: src/shared/lib/actions/theme-fragments/getThemeFragments.action.ts
/**
 * @file getThemeFragments.action.ts
 * @description Server Action para obtener los fragmentos de tema, forjada con
 *              observabilidad de élite, seguridad de tipos y resiliencia.
 * @version 2.0.0 (Elite Observability & Type Safety)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

// --- [INICIO DE REFACTORIZACIÓN DE TIPOS Y RESILIENCIA] ---
// Se define un schema de Zod como la SSoT para un fragmento de tema.
// El uso de z.unknown() es la alternativa segura a 'any'.
export const ThemeFragmentSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid().nullable(),
  name: z.string(),
  type: z.enum(["color", "font", "geometry"]),
  data: z.record(z.string(), z.unknown()),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ThemeFragment = z.infer<typeof ThemeFragmentSchema>;
// --- [FIN DE REFACTORIZACIÓN DE TIPOS Y RESILIENCIA] ---

export async function getThemeFragmentsAction(
  workspaceId: string,
  type: "color" | "font" | "geometry"
): Promise<
  ActionResult<{ global: ThemeFragment[]; workspace: ThemeFragment[] }>
> {
  const traceId = logger.startTrace("getThemeFragmentsAction_v2.0");
  // --- [INICIO DE CORRECCIÓN DE API LOGGER (TS2345)] ---
  // El segundo argumento de startGroup es para estilo, no para contexto.
  logger.startGroup(`[Action] Obteniendo fragmentos de tema...`);
  // --- [FIN DE CORRECCIÓN DE API LOGGER (TS2345)] ---

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
      `Se obtuvieron ${data.length} fragmentos de la base de datos.`
    );

    // Validar cada fragmento para garantizar la integridad de los datos
    const validation = z.array(ThemeFragmentSchema).safeParse(data);
    if (!validation.success) {
      logger.error("[Action] Los datos de fragmentos de la DB son inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      throw new Error("Formato de datos de fragmentos inesperado.");
    }

    const validFragments = validation.data;
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
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
