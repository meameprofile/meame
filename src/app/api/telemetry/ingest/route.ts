// RUTA: src/app/api/telemetry/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de Ingesta del Protocolo Heimdall (El Puente Bifröst).
 *              v2.0.0 (DB Contract Alignment & Elite Observability): Se alinea
 *              el payload de inserción con el contrato de la tabla de la base de
 *              datos, resolviendo un error crítico de "columna no encontrada".
 * @version 2.0.0
 * @author L.I.A. Legacy
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { HeimdallIngestPayloadSchema } from "@/shared/lib/telemetry/heimdall.contracts";
import type { HeimdallEvent } from "@/shared/lib/telemetry/heimdall.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

export async function POST(request: NextRequest) {
  const traceId = logger.startTrace("heimdall.ingestEndpoint_v2.0");
  const groupId = logger.startGroup(
    `[Heimdall Ingest] Procesando lote de eventos...`,
    traceId
  );

  try {
    const body = await request.json();
    logger.traceEvent(traceId, "Payload JSON recibido y parseado.");

    const validation = HeimdallIngestPayloadSchema.safeParse(body);

    if (!validation.success) {
      logger.warn("[Heimdall Ingest] Payload de ingestión inválido.", {
        traceId,
        errors: validation.error.flatten(),
      });
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }
    logger.traceEvent(traceId, "Payload de entrada validado contra schema.");

    const { events } = validation.data;
    if (events.length === 0) {
      logger.traceEvent(traceId, "Lote de eventos vacío, finalizando.");
      return new NextResponse("Payload accepted (empty)", { status: 202 });
    }

    const supabase = createServerClient();
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO v2.0.0] ---
    // El payload ahora cumple con el schema de la tabla 'heimdall_events'.
    const recordsToInsert = events.map((event: HeimdallEvent) => ({
      event_id: event.eventId,
      trace_id: event.traceId,
      event_name: event.eventName,
      status: event.status,
      timestamp: event.timestamp,
      duration_ms: event.duration,
      payload: event.payload as Json,
      context: event.context as Json, // 'path' está contenido aquí.
    }));
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO v2.0.0] ---
    logger.traceEvent(
      traceId,
      `Payload de Supabase generado para ${recordsToInsert.length} eventos.`
    );

    const { error } = await supabase
      .from("heimdall_events")
      .insert(recordsToInsert);

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    logger.success(
      `[Heimdall Ingest] Lote de ${events.length} eventos persistido con éxito.`,
      { traceId }
    );
    return new NextResponse("Payload accepted", { status: 202 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Heimdall Ingest] Fallo crítico en el endpoint.", {
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
