// RUTA: src/shared/lib/actions/auth/linkAnonymousSessionToUser.action.ts
/**
 * @file linkAnonymousSessionToUser.action.ts
 * @description Server Action que orquesta el "Traspaso de Identidad".
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const LinkSessionInputSchema = z.object({
  fingerprintId: z
    .string()
    .min(1, "El fingerprintId del visitante es requerido."),
});

type LinkSessionInput = z.infer<typeof LinkSessionInputSchema>;

export async function linkAnonymousSessionToUserAction(
  input: LinkSessionInput
): Promise<ActionResult<null>> {
  const traceId = logger.startTrace("linkAnonymousSessionToUserAction_v2.0");
  logger.startGroup(`[Auth Action] Vinculando sesión anónima...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("[Auth Action] Intento de vinculación no autorizado.", {
        traceId,
      });
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario autorizado: ${user.id}`);

    const validation = LinkSessionInputSchema.safeParse(input);
    if (!validation.success) {
      const firstError =
        validation.error.errors[0]?.message || "Payload inválido.";
      logger.warn("[Auth Action] Payload de vinculación inválido.", {
        error: firstError,
        traceId,
      });
      return { success: false, error: firstError };
    }
    const { fingerprintId } = validation.data;
    logger.traceEvent(traceId, `Fingerprint a vincular: ${fingerprintId}`);

    const { error: rpcError } = await supabase.rpc("link_fingerprint_to_user", {
      p_fingerprint_id: fingerprintId,
      p_user_id: user.id,
    });

    if (rpcError) {
      throw new Error(
        `Fallo en la RPC 'link_fingerprint_to_user': ${rpcError.message}`
      );
    }

    logger.success(
      `[Auth Action] Sesión anónima ${fingerprintId} vinculada con éxito al usuario ${user.id}.`,
      { traceId }
    );
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Auth Action] Fallo crítico durante la vinculación de la sesión.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: "No se pudo vincular el historial de la sesión.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
