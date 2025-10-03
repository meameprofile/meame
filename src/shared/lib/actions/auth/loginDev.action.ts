// RUTA: src/shared/lib/actions/auth/loginDev.action.ts
/**
 * @file loginDev.action.ts
 * @description Server Action para la autenticación en el DCC, ahora forjada con
 *              observabilidad de élite, un guardián de resiliencia y gestión
 *              de ID de sesión persistente.
 * @version 3.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { getSession } from "@/shared/lib/session";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import { createId } from "@paralleldrive/cuid2";

export async function loginDevAction(
  formData: FormData
): Promise<ActionResult<{ success: boolean }>> {
  const traceId = logger.startTrace("loginDevAction_v3.0");
  logger.startGroup("[Auth Action] Procesando login del DCC...");

  try {
    const password = formData.get("password");

    // Guardia de Resiliencia: Validar la entrada
    if (typeof password !== "string" || password.length === 0) {
      logger.warn("[Auth Action] Intento de login sin contraseña.", {
        traceId,
      });
      return { success: false, error: "La contraseña es requerida." };
    }

    if (password === process.env.DCC_PASSWORD) {
      logger.traceEvent(
        traceId,
        "Contraseña correcta. Obteniendo o creando sesión..."
      );
      const session = await getSession();

      // Generar ID de sesión si no existe
      if (!session.id) {
        session.id = createId();
        logger.info(
          `[Auth Action] Nueva sesión de DCC generada: ${session.id}`,
          { traceId }
        );
      }

      session.isDevAuthenticated = true;
      await session.save();
      logger.success(
        "[Auth Action] Sesión de desarrollador validada y guardada.",
        {
          sessionId: session.id,
          traceId,
        }
      );
      return { success: true, data: { success: true } };
    } else {
      logger.warn("[Auth Action] Intento de login con contraseña incorrecta.", {
        traceId,
      });
      return { success: false, error: "Contraseña incorrecta." };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Auth Action] Fallo crítico durante el login del DCC.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "Ocurrió un error inesperado en el servidor.",
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
