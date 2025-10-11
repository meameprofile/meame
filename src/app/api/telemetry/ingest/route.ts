// RUTA: src/app/api/telemetry/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de Ingesta del Protocolo Heimdall (El Puente Bifröst).
 *              v3.1.0 (Infrastructure Synchronized): Alineado y con seguridad de
 *              tipos garantizada contra el esquema de base de datos nivelado.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { NextResponse, type NextRequest } from "next/server";

import type { Json } from "@/shared/lib/supabase/database.types";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  HeimdallIngestPayloadSchema,
  type HeimdallEvent,
  type HeimdallEventInsert,
  type TaskHealthSummaryInsert,
} from "@/shared/lib/telemetry/heimdall.contracts";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

/**
 * Shaper puro para transformar un evento de aplicación a una fila de heimdall_events.
 */
function shapeToHeimdallEventRow(event: HeimdallEvent): HeimdallEventInsert {
  return {
    event_id: event.eventId,
    trace_id: event.traceId,
    task_id: event.taskId,
    step_name: event.stepName,
    event_name: event.title,
    status: event.status,
    timestamp: event.timestamp,
    duration_ms: event.duration,
    payload: event.payload as Json,
    context: event.context as Json,
  };
}

/**
 * Shaper puro que filtra y transforma un evento raíz de Tarea a una fila de task_health_summary.
 * Devuelve null si el evento no es un evento raíz de Tarea.
 */
function shapeToTaskHealthSummaryRow(
  event: HeimdallEvent
): TaskHealthSummaryInsert | null {
  if (
    event.taskId &&
    event.traceId === event.taskId &&
    (event.status === "SUCCESS" || event.status === "FAILURE")
  ) {
    return {
      task_id: event.taskId,
      task_name: event.title,
      status: event.status,
      duration_ms: event.duration,
      timestamp: event.timestamp,
      user_id: event.context.user,
      context: {
        path: event.context.path,
        runtime: event.context.runtime,
        payload: event.payload,
      } as Json,
    };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const taskId = logger.startTask(
    { domain: "HEIMDALL_INGEST", entity: "TELEMETRY_BATCH", action: "PROCESS" },
    "Processing Telemetry Batch"
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";

  try {
    const supabase = createServerClient();

    logger.taskStep(taskId, "VALIDATE_PAYLOAD", "IN_PROGRESS");
    const body = await request.json();
    const validation = HeimdallIngestPayloadSchema.safeParse(body);

    if (!validation.success) {
      logger.taskStep(taskId, "VALIDATE_PAYLOAD", "FAILURE", {
        errors: validation.error.flatten(),
      });
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }
    const { events } = validation.data;
    logger.taskStep(taskId, "VALIDATE_PAYLOAD", "SUCCESS", {
      eventCount: events.length,
    });

    if (events.length === 0) {
      return new NextResponse("Payload accepted (empty)", { status: 202 });
    }

    logger.taskStep(taskId, "TRANSFORM_EVENTS", "IN_PROGRESS");
    const heimdallEventsToInsert: HeimdallEventInsert[] = [];
    const taskSummariesToInsert: TaskHealthSummaryInsert[] = [];

    for (const event of events) {
      heimdallEventsToInsert.push(shapeToHeimdallEventRow(event));
      const summary = shapeToTaskHealthSummaryRow(event);
      if (summary) {
        taskSummariesToInsert.push(summary);
      }
    }
    logger.taskStep(taskId, "TRANSFORM_EVENTS", "SUCCESS", {
      forensicCount: heimdallEventsToInsert.length,
      summaryCount: taskSummariesToInsert.length,
    });

    logger.taskStep(taskId, "PERSIST_DATA", "IN_PROGRESS");
    const [summaryResult, eventsResult] = await Promise.all([
      taskSummariesToInsert.length > 0
        ? supabase.from("task_health_summary").insert(taskSummariesToInsert)
        : Promise.resolve({ error: null }),
      supabase.from("heimdall_events").insert(heimdallEventsToInsert),
    ]);

    if (summaryResult.error || eventsResult.error) {
      const errors = {
        summaryError: summaryResult.error?.message,
        eventsError: eventsResult.error?.message,
      };
      logger.taskStep(taskId, "PERSIST_DATA", "FAILURE", { errors });
      throw new Error(
        `Error de Supabase: ${summaryResult.error?.message || eventsResult.error?.message}`
      );
    }
    logger.taskStep(taskId, "PERSIST_DATA", "SUCCESS");

    return new NextResponse("Payload accepted", { status: 202 });
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Heimdall Ingest] Fallo crítico en el endpoint de ingestión.",
      { error: errorMessage, taskId }
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
