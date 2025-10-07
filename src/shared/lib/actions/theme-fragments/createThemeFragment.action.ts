// RUTA: src/shared/lib/actions/theme-fragments/createThemeFragment.action.ts
/**
 * @file createThemeFragment.action.ts
 * @description Server Action para crear un nuevo fragmento de tema.
 * @version 7.0.0 (Holistic Refactoring & Elite Compliance)
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
  type ThemeFragmentInsert,
  type ThemeFragmentRow,
} from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { ThemeFragment } from "./getThemeFragments.action";
import { mapSupabaseToThemeFragment } from "./_shapers/theme-fragments.shapers";

const CreateFragmentInputSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "El nombre no puede estar vacío."),
  type: z.enum(["color", "font", "geometry"]),
  data: z.record(z.string(), z.unknown()),
});

type CreateFragmentInput = z.infer<typeof CreateFragmentInputSchema>;

export async function createThemeFragmentAction(
  input: CreateFragmentInput
): Promise<ActionResult<{ newFragment: ThemeFragment }>> {
  const traceId = logger.startTrace("createThemeFragmentAction_v7.0");
  logger.startGroup(`[Action] Creando fragmento de tema...`, traceId);

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
      logger.warn("[Action] Datos de entrada inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      return {
        success: false,
        error: "Los datos proporcionados son inválidos.",
      };
    }
    logger.traceEvent(traceId, `Datos de entrada validados.`);
    const { workspaceId, name, type, data: fragmentData } = validation.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck) {
      throw new Error("Acceso denegado al workspace.");
    }
    logger.traceEvent(traceId, `Membresía del workspace verificada.`);

    const supabasePayload: ThemeFragmentInsert = {
      workspace_id: workspaceId,
      user_id: user.id,
      name,
      type,
      data: fragmentData as Json,
    };

    const { data: newFragmentRow, error: insertError } = await supabase
      .from("theme_fragments")
      .insert(supabasePayload)
      .select()
      .single();

    if (insertError)
      throw new Error(`Error de Supabase: ${insertError.message}`);

    const newFragment = mapSupabaseToThemeFragment(
      newFragmentRow as ThemeFragmentRow,
      traceId
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
