// RUTA: src/shared/lib/actions/workspaces/getWorkspacesForUser.action.ts
/**
 * @file getWorkspacesForUser.action.ts
 * @description Server Action para obtener los workspaces de un usuario, nivelada con
 *              observabilidad de élite y cumplimiento de contrato.
 * @version 3.0.0 (Holistic Observability & Contract Integrity)
 * @author L.I.A. Legacy
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

/**
 * @function mapSupabaseToWorkspace
 * @description Shaper que transforma una fila de la DB al formato de la aplicación.
 * @param {WorkspaceRow} row - La fila cruda de Supabase.
 * @returns {Workspace} La entidad de aplicación transformada.
 */
function mapSupabaseToWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    name: row.name,
  };
}

export async function getWorkspacesForUserAction(): Promise<
  ActionResult<Workspace[]>
> {
  const traceId = logger.startTrace("getWorkspacesForUserAction_v3.0");
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v3.0.0] ---
  const groupId = logger.startGroup(
    `[Action] Obteniendo workspaces del usuario...`,
    traceId
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v3.0.0] ---

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
      throw new Error(`Error de Supabase: ${error.message}`);
    }
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${data.length} registros de membresía.`
    );

    const workspaces = data
      .map((item) => item.workspaces as WorkspaceRow | null)
      .filter((ws): ws is WorkspaceRow => ws !== null)
      .map(mapSupabaseToWorkspace);

    // Guardián de Contrato: Validamos la data transformada.
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
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v3.0.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v3.0.0] ---
  }
}
