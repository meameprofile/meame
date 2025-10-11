// RUTA: src/shared/lib/actions/supabase/seeding/superuser.ts
/**
 * @file superuser.ts
 * @description Script de seed para crear un superusuario de desarrollo en Supabase,
 *              ahora con observabilidad y resiliencia de élite.
 * @version 6.1.0 (Elite Observability & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { User } from "@supabase/supabase-js";

import { scriptLogger as logger } from "../../_utils/logger";
import { createScriptClient } from "../../_utils/supabaseClient";
import type { ScriptActionResult as ActionResult } from "../../_utils/types";

export default async function createSuperUser(): Promise<
  ActionResult<{ userId: string }>
> {
  const traceId = logger.startTrace("createSuperUser_v6.1");
  const groupId = logger.startGroup(
    "🌱 Iniciando creación de Superusuario en Supabase..."
  );

  try {
    const supabaseAdmin = createScriptClient();
    const superUserEmail = "superuser@webvork.dev";
    const superUserPassword = "superuserpassword123";

    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users.find(
      (user: User) => user.email === superUserEmail
    );

    if (existingUser) {
      logger.warn(
        `El superusuario con email ${superUserEmail} ya existe. Saltando creación.`,
        { traceId }
      );
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
