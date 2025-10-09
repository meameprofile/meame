// src/shared/lib/telemetry/heimdall.server.ts
/**
 * @file heimdall.server.ts
 * @description Módulo soberano para la persistencia de eventos, con un
 *              Guardián de Contexto de Petición y una higiene de código de élite.
 * @version 2.1.0 (Elite Hygiene & Context-Aware Logging)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { headers } from "next/headers";
import type { HeimdallEvent } from "@/shared/lib/telemetry/heimdall.contracts";
import type { HeimdallEventInsert } from "@/shared/lib/telemetry/heimdall.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

export async function persistHeimdallEvent(
  event: HeimdallEvent
): Promise<void> {
  try {
    // --- Guardián de Contexto de Petición ---
    try {
      headers();
    } catch (error) {
      // --- [INICIO] REFACTORIZACIÓN DE HIGIENE Y LÓGICA ---
      // Se utiliza la variable `error` capturada para un log más informativo.
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Heimdall Server] Persistencia omitida para el evento "${event.eventName}" (fuera de ámbito de petición).`,
          { error: error instanceof Error ? error.message : "Context error" }
        );
      }
      // --- [FIN] REFACTORIZACIÓN DE HIGIENE Y LÓGICA ---
      return;
    }

    const supabase = createServerClient();

    const recordToInsert: HeimdallEventInsert = {
      event_id: event.eventId,
      trace_id: event.traceId,
      event_name: event.eventName,
      status: event.status,
      timestamp: event.timestamp,
      duration_ms: event.duration,
      payload: event.payload as Json,
      context: event.context as Json,
    };

    const { error } = await supabase
      .from("heimdall_events")
      .insert(recordToInsert);

    if (error) {
      console.error(
        `[Heimdall Server Persistor] Fallo de persistencia directa:`,
        error
      );
    }
  } catch (e) {
    console.error(
      `[Heimdall Server Persistor] Error no controlado al persistir evento:`,
      e
    );
  }
}
