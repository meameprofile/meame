// RUTA: src/app/api/telemetry/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de Ingesta del Protocolo Heimdall (El Puente Bifröst).
 *              Recibe lotes de eventos de telemetría y los persiste en la Bóveda de Mimir.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { HeimdallIngestPayloadSchema } from "@/shared/lib/telemetry/heimdall.contracts";
import type { HeimdallEvent } from "@/shared/lib/telemetry/heimdall.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

export async function POST(request: NextRequest) {
  const traceId = logger.startTrace("heimdall.ingestEndpoint");

  try {
    const body = await request.json();
    const validation = HeimdallIngestPayloadSchema.safeParse(body);

    if (!validation.success) {
      logger.warn("[Heimdall Ingest] Payload de ingestión inválido.", {
        traceId,
        errors: validation.error.flatten(),
      });
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }

    const { events } = validation.data;
    if (events.length === 0) {
      return new NextResponse("Payload accepted (empty)", { status: 202 });
    }

    const supabase = createServerClient();
    const recordsToInsert = events.map((event: HeimdallEvent) => ({
      event_id: event.eventId,
      trace_id: event.traceId,
      event_name: event.eventName,
      status: event.status,
      timestamp: event.timestamp,
      duration_ms: event.duration,
      path: event.context.path,
      payload: event.payload as Json,
      context: event.context as Json,
    }));

    const { error } = await supabase
      .from("heimdall_events")
      .insert(recordsToInsert);

    if (error) throw new Error(`Error de Supabase: ${error.message}`);

    logger.success(
      `[Heimdall Ingest] Lote de ${events.length} eventos persistido.`,
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
    logger.endTrace(traceId);
  }
}
