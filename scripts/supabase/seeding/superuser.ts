// RUTA: scripts/supabase/seed-superuser.ts
/**
 * @file seed-superuser.ts
 * @description Script de seed para crear un superusuario de desarrollo en Supabase.
 * @version 4.0.0 (Architectural Purity)
 * @author L.I.A. Legacy
 */
import { createScriptClient } from "./script-client"; // <-- RUTA CORREGIDA
import { logger } from "../../src/shared/lib/logging";
import type { ActionResult } from "../../src/shared/lib/types/actions.types";

async function createSuperUser(): Promise<ActionResult<{ userId: string }>> {
  const traceId = logger.startTrace("createSuperUser_v4.0");
  logger.startGroup("🌱 Iniciando creación de Superusuario en Supabase...");

  try {
    const supabaseAdmin = createScriptClient();

    const superUserEmail = "superuser@webvork.dev";
    const superUserPassword = "superuserpassword123";

    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users.find((user) => user.email === superUserEmail);

    if (existingUser) {
      logger.warn(
        `El superusuario con email ${superUserEmail} ya existe. Saltando creación.`,
        { traceId }
      );
      logger.endGroup();
      logger.endTrace(traceId);
      return { success: true, data: { userId: existingUser.id } };
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: superUserEmail,
      password: superUserPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Super Usuario Webvork",
        role: "admin",
      },
    });

    if (error) throw error;

    if (data.user) {
      logger.success("✅ Superusuario creado con éxito en Supabase.", {
        traceId,
        userId: data.user.id,
      });
      return { success: true, data: { userId: data.user.id } };
    }

    throw new Error(
      "La creación del usuario no devolvió un objeto de usuario."
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "Fallo catastrófico en el script de creación de superusuario.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export default createSuperUser;
