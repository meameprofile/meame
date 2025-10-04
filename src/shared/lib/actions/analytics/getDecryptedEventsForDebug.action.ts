// RUTA: src/shared/lib/actions/analytics/getDecryptedEventsForDebug.action.ts
/**
 * @file getDecryptedEventsForDebug.action.ts
 * @description Server Action para obtener y desencriptar eventos de campaña,
 *              ahora alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 4.0.0 (Sovereign Contract Aligned & Elite Resilience)
 * @author L.I.A. Legacy
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { decryptServerData } from "@/shared/lib/utils/server-encryption";
import {
  AuraEventPayloadSchema,
  type AuraEventPayload,
} from "@/shared/lib/schemas/analytics/aura.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";

interface GetDecryptedEventsInput {
  campaignId: string;
  sessionId?: string;
  limit?: number;
  page?: number;
}

export async function getDecryptedEventsForDebugAction(
  input: GetDecryptedEventsInput
): Promise<ActionResult<{ events: AuraEventPayload[]; total: number }>> {
  const traceId = logger.startTrace("getDecryptedEventsAction_v4.0");
  logger.startGroup(`[Action] Obteniendo eventos desencriptados...`, traceId);

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado.", { traceId });
    return { success: false, error: "auth_required" };
  }

  try {
    const { campaignId, sessionId, limit = 20, page = 1 } = input;
    const offset = (page - 1) * limit;

    let queryBuilder = supabase
      .from("visitor_campaign_events")
      .select("*, count", { count: "exact" })
      .eq("campaign_id", campaignId);

    if (sessionId) {
      queryBuilder = queryBuilder.eq("session_id", sessionId);
    }
    // Podríamos añadir más filtros aquí en el futuro si es necesario.

    logger.traceEvent(traceId, "Query de Supabase construida.", { input });

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    if (!data) return { success: true, data: { events: [], total: 0 } };

    logger.traceEvent(
      traceId,
      `Se obtuvieron ${data.length} eventos de la DB.`
    );

    const decryptedEvents: AuraEventPayload[] = data.map(
      (event: VisitorCampaignEventRow) => {
        const baseEventData = {
          eventType: event.event_type,
          sessionId: event.session_id,
          campaignId: event.campaign_id,
          variantId: event.variant_id,
          timestamp: new Date(event.created_at).getTime(),
        };

        try {
          if (!event.payload) {
            throw new Error("Payload nulo o indefinido.");
          }
          const decryptedPayloadString = decryptServerData(
            event.payload as string
          );
          const decryptedPayloadObject = JSON.parse(decryptedPayloadString);

          const validation = AuraEventPayloadSchema.safeParse({
            ...baseEventData,
            payload: decryptedPayloadObject,
          });

          if (!validation.success) {
            logger.warn(
              `[Guardián] Payload desencriptado para evento ${event.event_id} no cumple con el schema.`,
              {
                traceId,
                eventId: event.event_id,
                errors: validation.error.flatten(),
              }
            );
          }
          return { ...baseEventData, payload: decryptedPayloadObject };
        } catch (decryptionError) {
          const errorMessage =
            decryptionError instanceof Error
              ? decryptionError.message
              : "Error desconocido.";
          logger.warn(
            `[Guardián] Fallo al desencriptar o parsear payload para evento ${event.event_id}`,
            { traceId, eventId: event.event_id, error: errorMessage }
          );
          return {
            ...baseEventData,
            payload: { error: `Failed to decrypt: ${errorMessage}` },
          };
        }
      }
    );

    logger.traceEvent(
      traceId,
      `Se procesaron ${decryptedEvents.length} eventos.`
    );

    return {
      success: true,
      data: { events: decryptedEvents, total: count ?? 0 },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener eventos.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron obtener los eventos: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
