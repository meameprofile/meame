// RUTA: src/shared/lib/actions/analytics/getDecryptedEventsForDebug.action.ts
/**
 * @file getDecryptedEventsForDebug.action.ts
 * @description Server Action de élite para obtener y desencriptar eventos de telemetría para depuración.
 *              v7.0.0 (Hyper-Granular Observability & Elite Resilience): Refactorizado
 *              para inyectar observabilidad a nivel de evento individual dentro del bucle
 *              de procesamiento y fortalecer el guardián de resiliencia ante fallos
 *              de desencriptación o transformación de datos.
 * @version 7.0.0
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { decryptServerData } from "@/shared/lib/utils/server-encryption";
import type { AuraEventPayload } from "@/shared/lib/schemas/analytics/aura.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";
import { mapSupabaseToAuraEventPayload } from "./_shapers/analytics.shapers";

interface GetDecryptedEventsInput {
  campaignId: string;
  sessionId?: string;
  limit?: number;
  page?: number;
}

/**
 * @function getDecryptedEventsForDebugAction
 * @description Orquesta la obtención, desencriptación y transformación de eventos de campaña.
 *              Es una herramienta de diagnóstico y no debe ser usada en flujos de producción críticos.
 * @param {GetDecryptedEventsInput} input - Los parámetros para la consulta de eventos.
 * @returns {Promise<ActionResult<{ events: AuraEventPayload[]; total: number }>>} Un objeto con el
 *          resultado, conteniendo los eventos desencriptados o un mensaje de error.
 */
export async function getDecryptedEventsForDebugAction(
  input: GetDecryptedEventsInput
): Promise<ActionResult<{ events: AuraEventPayload[]; total: number }>> {
  const traceId = logger.startTrace("getDecryptedEventsAction_v7.0");
  const groupId = logger.startGroup(
    `[Action] Obteniendo eventos desencriptados para depuración...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    logger.traceEvent(traceId, "Paso 1/5: Autorizando usuario...");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Paso 1/5 Completado: Usuario ${user.id} autorizado.`);

    const { campaignId, sessionId, limit = 20, page = 1 } = input;
    const offset = (page - 1) * limit;

    logger.traceEvent(traceId, "Paso 2/5: Construyendo y ejecutando consulta a Supabase...");
    let queryBuilder = supabase
      .from("visitor_campaign_events")
      .select("*, count", { count: "exact" })
      .eq("campaign_id", campaignId);
    if (sessionId) queryBuilder = queryBuilder.eq("session_id", sessionId);

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    if (!data) return { success: true, data: { events: [], total: 0 } };
    logger.traceEvent(traceId, `Paso 2/5 Completado: Se obtuvieron ${data.length} eventos encriptados.`);

    logger.traceEvent(traceId, "Paso 3/5: Iniciando proceso de desencriptación y transformación en paralelo...");
    const decryptedEventsPromises = data.map(
      async (event: VisitorCampaignEventRow) => {
        const eventTraceId = logger.startTrace(`decryptEvent:${event.event_id}`);
        try {
          if (!event.payload) throw new Error("Payload nulo o indefinido.");

          const decryptedPayloadString = await decryptServerData(event.payload as string);
          const decryptedPayloadObject = JSON.parse(decryptedPayloadString);

          const transformedEvent = mapSupabaseToAuraEventPayload(
            event,
            decryptedPayloadObject,
            eventTraceId
          );
          logger.success(`[Action] Evento ${event.event_id} procesado con éxito.`, { traceId: eventTraceId });
          return transformedEvent;
        } catch (decryptionError) {
          const errorMessage = decryptionError instanceof Error ? decryptionError.message : "Error desconocido.";
          logger.warn(`[Guardián] Fallo al procesar evento ${event.event_id}. Será omitido.`, {
            traceId: eventTraceId, // Correlaciona el error del evento con la traza principal.
            error: errorMessage,
            originalEvent: event,
          });
          return null;
        } finally {
            logger.endTrace(eventTraceId);
        }
      }
    );

    const decryptedEvents = (await Promise.all(decryptedEventsPromises)).filter(
      (event): event is AuraEventPayload => event !== null
    );
    logger.traceEvent(traceId, `Paso 3/5 Completado: ${decryptedEvents.length} eventos procesados con éxito.`);

    logger.traceEvent(traceId, "Paso 4/5: Ensamblando respuesta final...");
    const responseData = { events: decryptedEvents, total: count ?? 0 };
    logger.success(`[Action] Se procesaron ${decryptedEvents.length} de ${data.length} eventos válidos.`, { traceId });
    return { success: true, data: responseData };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener eventos para depuración.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron obtener los eventos: ${errorMessage}`,
    };
  } finally {
    logger.traceEvent(traceId, "Paso 5/5: Finalizando traza de ejecución.");
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
