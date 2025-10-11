// RUTA: src/shared/lib/actions/account/get-current-user-profile.action.ts (REFACTORIZADO)
/**
 * @file get-current-user-profile.action.ts
 * @description Server Action soberana para obtener los datos del perfil del usuario.
 * @version 11.0.0 (Hyper-Granular Observability & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter"; // Importación actualizada
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function getCurrentUserProfile_Action(): Promise<
  ActionResult<ProfilesRow | null>
> {
  const traceId = logger.startTrace("getCurrentUserProfile_Action_v11.0");
  const groupId = logger.startGroup(
    `[Action] Solicitando perfil de usuario...`
  );

  try {
    const supabase = createServerClient();

    // **EVENTO DE TRAZA 1: Autorización**
    logger.traceEvent(traceId, "Paso 1/3: Autorizando sesión de usuario...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        "[Action] Sesión no encontrada. No hay usuario autenticado.",
        { traceId }
      );
      return { success: true, data: null };
    }
    logger.traceEvent(
      traceId,
      `Paso 1/3 Completado. Usuario autorizado: ${user.id}`
    );

    // **EVENTO DE TRAZA 2: Consulta a Base de Datos**
    logger.traceEvent(
      traceId,
      `Paso 2/3: Consultando la tabla 'profiles' para el usuario ${user.id}...`
    );
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(
          `[Action] No se encontró perfil para el usuario ${user.id}, pero la operación es exitosa.`,
          { traceId }
        );
        return { success: true, data: null };
      }
      // Errores inesperados de DB se lanzan para ser capturados por el guardián principal.
      throw new Error(`Error de Supabase: ${error.message}`);
    }
    logger.traceEvent(
      traceId,
      "Paso 2/3 Completado. Datos de perfil obtenidos."
    );

    // **EVENTO DE TRAZA 3: Finalización**
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
    logger.traceEvent(traceId, "Paso 3/3: Finalizando ejecución de la acción.");
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
