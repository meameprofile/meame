// RUTA: src/shared/lib/actions/account/get-current-user-profile.action.ts
/**
 * @file get-current-user-profile.action.ts
 * @description Server Action soberana para obtener los datos del perfil del usuario.
 * @version 9.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";

export async function getCurrentUserProfile_Action(): Promise<
  ActionResult<ProfilesRow | null>
> {
  const traceId = logger.startTrace("getCurrentUserProfile_Action_v9.0");
  logger.startGroup(`[Action] Solicitando perfil de usuario...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Action] No hay usuario autenticado.", { traceId });
      return { success: true, data: null };
    }
    logger.traceEvent(traceId, `Usuario autorizado: ${user.id}`);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(
          `[Action] No se encontró perfil para el usuario ${user.id}.`,
          { traceId }
        );
        return { success: true, data: null };
      }
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    logger.success("[Action] Perfil de usuario obtenido con éxito.", {
      userId: user.id,
      traceId,
    });
    return { success: true, data: profile };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener el perfil.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo obtener la información del perfil.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
