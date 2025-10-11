// RUTA: src/shared/lib/actions/telemetry/getTaskHealthSummaries.action.ts
/**
 * @file getTaskHealthSummaries.action.ts
 * @description Server Action para obtener los resúmenes de salud de las tareas
 *              desde el Sismógrafo del Observatorio Heimdall.
 * @version 1.1.0 (SQL Integrity Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";
import type { ActionResult } from "@/shared/lib/types/actions.types";

// Contrato de datos SSoT, alineado con la salida de la RPC v1.1
export const TaskHealthSummarySchema = z.object({
  task_id: z.string(),
  task_name: z.string(),
  task_status: z.enum(["SUCCESS", "FAILURE"]), // <-- CAMPO ACTUALIZADO
  duration_ms: z.number().nullable(),
  task_timestamp: z.string().datetime(), // <-- CAMPO ACTUALIZADO
  user_id: z.string().uuid().nullable(),
  workspace_id: z.string().uuid().nullable(),
});

export type TaskHealthSummary = z.infer<typeof TaskHealthSummarySchema>;

export async function getTaskHealthSummariesAction(): Promise<
  ActionResult<TaskHealthSummary[]>
> {
  const taskId = logger.startTask(
    {
      domain: "HEIMDALL_OBSERVATORY",
      entity: "SYSTEM_HEALTH",
      action: "FETCH_SUMMARIES",
    },
    "Fetching task health summaries for System Health Seismograph"
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";

  try {
    const supabase = createServerClient();
    logger.taskStep(taskId, "AUTH_CHECK", "IN_PROGRESS");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      logger.taskStep(taskId, "AUTH_CHECK", "FAILURE", {
        reason: "No active session",
      });
      throw new Error("auth_required");
    }
    logger.taskStep(taskId, "AUTH_CHECK", "SUCCESS");

    logger.taskStep(taskId, "RPC_CALL", "IN_PROGRESS");
    const { data, error } = await supabase.rpc("get_task_health_summaries", {
      p_limit: 50,
    });

    if (error) {
      logger.taskStep(taskId, "RPC_CALL", "FAILURE", { error: error.message });
      throw new Error(`Error en RPC: ${error.message}`);
    }
    logger.taskStep(taskId, "RPC_CALL", "SUCCESS", { count: data.length });

    logger.taskStep(taskId, "DATA_VALIDATION", "IN_PROGRESS");
    const validation = z.array(TaskHealthSummarySchema).safeParse(data);
    if (!validation.success) {
      logger.taskStep(taskId, "DATA_VALIDATION", "FAILURE", {
        error: validation.error.flatten(),
      });
      throw new Error(
        "Los datos recibidos de la base de datos están corruptos."
      );
    }
    logger.taskStep(taskId, "DATA_VALIDATION", "SUCCESS");

    return { success: true, data: validation.data };
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[getTaskHealthSummariesAction] Fallo crítico.", {
      error: errorMessage,
      taskId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
