// RUTA: src/shared/lib/actions/account/get-current-user-profile.action.ts
/**
 * @file get-current-user-profile.action.ts
 * @description Server Action soberana para obtener los datos del perfil del
 *              usuario, alineada con la Gran Refactorización y el contrato
 *              de datos derivado de la SSoT de la base de datos.
 * @version 8.0.0 (Definitive SSoT-Derived Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";

export async function getCurrentUserProfile_Action(): Promise<
  ActionResult<ProfilesRow | null>
> {
  const traceId = logger.startTrace("getCurrentUserProfile_Action_v8.0");
  logger.info("[Profile Action] Solicitando perfil de usuario...", { traceId });

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Profile Action] No hay usuario autenticado.", { traceId });
      return { success: true, data: null };
    }

    logger.traceEvent(traceId, `Usuario autorizado: ${user.id}`);

    // La consulta a la base de datos devuelve un tipo que ahora coincide
    // perfectamente con nuestra SSoT `ProfilesRow`.
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(
          `[Profile Action] No se encontró perfil para el usuario ${user.id}.`,
          { traceId }
        );
        return { success: true, data: null };
      }
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    logger.success("[Profile Action] Perfil de usuario obtenido con éxito.", {
      userId: user.id,
      traceId,
    });
    // No se necesita "shaper". La data es inherentemente segura y alineada con el contrato.
    return { success: true, data: profile };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Profile Action] Fallo crítico al obtener el perfil.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo obtener la información del perfil.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
