// RUTA: src/shared/lib/actions/analytics/getDecryptedEventsForDebug.action.ts
/**
 * @file getDecryptedEventsForDebug.action.ts
 * @description Server Action para obtener y desencriptar eventos de campaña, forjada
 *              con un guardián de resiliencia granular y observabilidad de élite.
 * @version 2.2.0 (Elite Code Hygiene Restoration)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { decryptServerData } from "@/shared/lib/utils/server-encryption";
import {
  AuraEventSchema,
  type AuraEventPayload,
} from "@/shared/lib/schemas/analytics/aura.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";

interface SupabaseEventRecord {
  id: string;
  session_id: string;
  user_id: string | null;
  workspace_id: string;
  campaign_id: string;
  variant_id: string;
  event_type: string;
  payload: string;
  created_at: string;
}

interface GetDecryptedEventsInput {
  campaignId: string;
  sessionId?: string;
  userId?: string;
  limit?: number;
  page?: number;
}

export async function getDecryptedEventsForDebugAction(
  input: GetDecryptedEventsInput
): Promise<ActionResult<{ events: AuraEventPayload[]; total: number }>> {
  const traceId = logger.startTrace("getDecryptedEventsForDebugAction_v2.2");
  logger.startGroup(`[Action] Obteniendo eventos desencriptados...`);

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !input.sessionId) {
    logger.warn("[Action] Intento no autorizado.", { traceId });
    return { success: false, error: "auth_required" };
  }

  try {
    const { campaignId, sessionId, userId, limit = 20, page = 1 } = input;
    const offset = (page - 1) * limit;

    let queryBuilder;
    if (userId) {
      queryBuilder = supabase
        .from("visitor_campaign_events")
        .select("*, count()", { count: "exact" })
        .eq("user_id", userId)
        .eq("campaign_id", campaignId);
    } else if (sessionId) {
      queryBuilder = supabase
        .from("anonymous_campaign_events")
        .select("*, count()", { count: "exact" })
        .eq("session_id", sessionId)
        .eq("campaign_id", campaignId);
    } else {
      throw new Error("Se requiere un userId o sessionId.");
    }

    logger.traceEvent(traceId, "Ejecutando consulta a Supabase...", { input });
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
      (event: SupabaseEventRecord) => {
        const baseEventData = {
          eventType: event.event_type,
          sessionId: event.session_id,
          campaignId: event.campaign_id,
          variantId: event.variant_id,
          timestamp: new Date(event.created_at).getTime(),
        };

        let decryptedPayloadString: string;
        try {
          decryptedPayloadString = decryptServerData(event.payload);
        } catch {
          // --- [INICIO DE CORRECCIÓN DE HIGIENE] --- Se elimina `_decryptionError`
          logger.warn(
            `[Action] Fallo al desencriptar payload para evento ${event.id}`,
            { traceId, eventId: event.id }
          );
          return {
            ...baseEventData,
            payload: { error: "Failed to decrypt payload." },
          };
        } // --- [FIN DE CORRECCIÓN DE HIGIENE] ---

        try {
          const decryptedPayloadObject = JSON.parse(decryptedPayloadString);
          const validation = AuraEventSchema.pick({
            eventType: true,
            payload: true,
            sessionId: true,
            campaignId: true,
            variantId: true,
            timestamp: true,
          }).safeParse({
            ...baseEventData,
            payload: decryptedPayloadObject,
          });

          if (!validation.success) {
            logger.warn(
              `[Action] Payload desencriptado para evento ${event.id} no cumple con el schema.`,
              { traceId, eventId: event.id, errors: validation.error.flatten() }
            );
          }
          return { ...baseEventData, payload: decryptedPayloadObject };
        } catch {
          // --- [INICIO DE CORRECCIÓN DE HIGIENE] --- Se elimina `_parseError`
          logger.warn(
            `[Action] Fallo al parsear JSON del payload para evento ${event.id}`,
            { traceId, eventId: event.id }
          );
          return {
            ...baseEventData,
            payload: { error: "Failed to parse decrypted JSON payload." },
          };
        } // --- [FIN DE CORRECCIÓN DE HIGIENE] ---
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
