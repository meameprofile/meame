// RUTA: src/shared/lib/actions/workspaces/getWorkspacesForUser.action.ts
/**
 * @file getWorkspacesForUser.action.ts
 * @description Server Action para obtener los workspaces de un usuario, nivelada con
 *              seguridad de tipos explícita para resolver la fuga de 'any'.
 * @version 3.1.0 (Explicit Type Injection)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  WorkspaceSchema,
  type Workspace,
} from "@/shared/lib/schemas/entities/workspace.schema";
import type { WorkspaceRow } from "@/shared/lib/schemas/workspaces/workspaces.contracts";

// --- [INICIO DE REFACTORIZACIÓN DE TIPO v3.1.0] ---
// Se define un tipo explícito para la forma de los datos que devuelve la consulta anidada.
type WorkspaceMemberWithWorkspace = {
  workspaces: WorkspaceRow | null;
};
// --- [FIN DE REFACTORIZACIÓN DE TIPO v3.1.0] ---

function mapSupabaseToWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    name: row.name,
  };
}

export async function getWorkspacesForUserAction(): Promise<
  ActionResult<Workspace[]>
> {
  const traceId = logger.startTrace("getWorkspacesForUserAction_v3.1");
  const groupId = logger.startGroup(
    `[Action] Obteniendo workspaces del usuario...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces (id, name)")
      .eq("user_id", user.id);

    if (error) throw new Error(`Error de Supabase: ${error.message}`);
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${data.length} registros de membresía.`
    );

    // --- [INICIO DE REFACTORIZACIÓN DE TIPO v3.1.0] ---
    // Se aplica el tipo explícito a los datos antes de mapearlos.
    const workspaces = (data as WorkspaceMemberWithWorkspace[])
      .map((item) => item.workspaces)
      .filter((ws): ws is WorkspaceRow => ws !== null)
      .map(mapSupabaseToWorkspace);
    // --- [FIN DE REFACTORIZACIÓN DE TIPO v3.1.0] ---

    const validation = z.array(WorkspaceSchema).safeParse(workspaces);
    if (!validation.success) {
      logger.error("[Action] Los datos de workspace de la DB son inválidos.", {
        errors: validation.error.flatten(),
        traceId,
      });
      throw new Error("Formato de datos de workspace inesperado.");
    }
    logger.traceEvent(
      traceId,
      `${validation.data.length} workspaces validados.`
    );

    logger.success(
      `[Action] Se encontraron ${validation.data.length} workspaces para el usuario.`,
      { traceId }
    );
    return { success: true, data: validation.data };
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
