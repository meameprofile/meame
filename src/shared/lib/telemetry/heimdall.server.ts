// RUTA: src/shared/lib/telemetry/heimdall.server.ts
/**
 * @file heimdall.server.ts
 * @description Módulo soberano y de servidor para la persistencia de eventos de telemetría.
 *              v1.1.0 (Database Contract Alignment): Se alinea el payload de inserción
 *              con el contrato real de la tabla 'heimdall_events'.
 * @version 1.1.0
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import type { HeimdallEvent } from "@/shared/lib/telemetry/heimdall.contracts";
import type { HeimdallEventInsert } from "@/shared/lib/telemetry/heimdall.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

export async function persistHeimdallEvent(
  event: HeimdallEvent
): Promise<void> {
  try {
    const supabase = createServerClient();

    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO v1.1.0] ---
    // La columna 'path' no existe en la tabla. El path es parte del 'context'.
    // El payload de inserción ahora refleja el schema de 'HeimdallEventInsert' correctamente.
    const recordToInsert: HeimdallEventInsert = {
      event_id: event.eventId,
      trace_id: event.traceId,
      event_name: event.eventName,
      status: event.status,
      timestamp: event.timestamp,
      duration_ms: event.duration,
      payload: event.payload as Json,
      context: event.context as Json, // 'path' está contenido aquí dentro.
    };
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO v1.1.0] ---

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
