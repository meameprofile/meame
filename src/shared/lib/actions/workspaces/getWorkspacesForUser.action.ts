// RUTA: src/shared/lib/actions/workspaces/getWorkspacesForUser.action.ts
/**
 * @file getWorkspacesForUser.action.ts
 * @description Server Action de producción para obtener todos los workspaces
 *              a los que pertenece el usuario autenticado.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  WorkspaceSchema,
  type Workspace,
} from "@/shared/lib/schemas/entities/workspace.schema";
import { z } from "zod";

export async function getWorkspacesForUserAction(): Promise<
  ActionResult<Workspace[]>
> {
  const traceId = logger.startTrace("getWorkspacesForUserAction");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado de obtener workspaces.", {
      traceId,
    });
    return { success: false, error: "auth_required" };
  }

  logger.info(`[Action] Solicitando workspaces para el usuario: ${user.id}`, {
    traceId,
  });

  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(
        `
        workspaces (
          id,
          name
        )
      `
      )
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    // El resultado es un array de objetos { workspaces: { id, name } },
    // así que lo aplanamos y validamos.
    const workspaces = data.map((item) => item.workspaces).filter(Boolean);
    const validatedWorkspaces = z.array(WorkspaceSchema).parse(workspaces);

    logger.success(
      `[Action] Se encontraron ${validatedWorkspaces.length} workspaces para el usuario.`,
      { traceId }
    );
    return { success: true, data: validatedWorkspaces };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico durante la obtención de workspaces.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron cargar los espacios de trabajo: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
