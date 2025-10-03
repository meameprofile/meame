// RUTA: src/shared/lib/actions/theme-fragments/createThemeFragment.action.ts
/**
 * @file createThemeFragment.action.ts
 * @description Server Action para crear un nuevo fragmento de tema en un workspace,
 *              forjada con observabilidad de élite y resiliencia.
 * @version 2.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ThemeFragment } from "./getThemeFragments.action";

// --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA Y TIPOS] ---
// Se crea un schema de Zod para validar la entrada, eliminando 'any'.
const CreateFragmentInputSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "El nombre no puede estar vacío."),
  type: z.enum(["color", "font", "geometry"]),
  data: z.record(z.string(), z.unknown()), // Alternativa segura a 'any'
});

type CreateFragmentInput = z.infer<typeof CreateFragmentInputSchema>;
// --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA Y TIPOS] ---

export async function createThemeFragmentAction(
  input: CreateFragmentInput
): Promise<ActionResult<{ newFragment: ThemeFragment }>> {
  const traceId = logger.startTrace("createThemeFragmentAction_v2.0");
  // --- [INICIO DE CORRECCIÓN DE API LOGGER (TS2345)] ---
  // El segundo argumento de startGroup es para estilo, no para contexto.
  logger.startGroup(`[Action] Creando fragmento de tema...`);
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

    const validation = CreateFragmentInputSchema.safeParse(input);
    if (!validation.success) {
      logger.warn("[Action] Input de creación de fragmento inválido.", {
        errors: validation.error.flatten(),
        traceId,
      });
      return { success: false, error: "Datos de entrada inválidos." };
    }

    const { workspaceId, name, type, data: fragmentData } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );

    if (memberError || !memberCheck) {
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(traceId, `Membresía del workspace verificada.`);

    const { data: newFragment, error: insertError } = await supabase
      .from("theme_fragments")
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        name,
        type,
        data: fragmentData,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error de Supabase: ${insertError.message}`);
    }
    logger.traceEvent(
      traceId,
      `Fragmento insertado en DB con ID: ${newFragment.id}`
    );

    logger.success(`[Action] Fragmento '${name}' creado con éxito.`);
    return { success: true, data: { newFragment } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al crear fragmento de tema.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: "No se pudo guardar el nuevo estilo." };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
