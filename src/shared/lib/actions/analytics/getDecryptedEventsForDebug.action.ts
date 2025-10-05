// APARATO 1/2: ACCIÓN DE DESENCRIPTADO (NIVELACIÓN DEFINITIVA)
// RUTA: src/shared/lib/actions/analytics/getDecryptedEventsForDebug.action.ts

/**
 * @file getDecryptedEventsForDebug.action.ts
 * @description Server Action para obtener y desencriptar eventos, con manejo asíncrono robusto,
 *              observabilidad de élite y alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 5.0.0 (Asynchronous Resilience & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
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
  const traceId = logger.startTrace("getDecryptedEventsAction_v5.0");
  logger.startGroup(`[Action] Obteniendo eventos desencriptados...`, traceId);

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado.", { traceId });
    logger.endGroup();
    logger.endTrace(traceId);
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

    logger.traceEvent(traceId, "Query de Supabase construida.", { input });

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    if (!data) {
      logger.traceEvent(
        traceId,
        "No se encontraron eventos en la base de datos."
      );
      return { success: true, data: { events: [], total: 0 } };
    }
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${data.length} eventos encriptados de la DB.`
    );

    const decryptedEventsPromises = data.map(
      async (event: VisitorCampaignEventRow): Promise<AuraEventPayload> => {
        const baseEventData = {
          eventType: event.event_type,
          sessionId: event.session_id,
          campaignId: event.campaign_id,
          variantId: event.variant_id,
          timestamp: new Date(event.created_at).getTime(),
        };

        try {
          if (!event.payload) {
            throw new Error("Payload nulo o indefinido en la base de datos.");
          }

          // SOLUCIÓN DEFINITIVA: Se utiliza 'await' para manejar la posible Promesa
          const decryptedPayloadString = await decryptServerData(
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

    const decryptedEvents = await Promise.all(decryptedEventsPromises);

    logger.success(
      `[Action] Se procesaron y desencriptaron ${decryptedEvents.length} eventos.`,
      { traceId }
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
