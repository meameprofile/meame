// RUTA: src/shared/lib/actions/analytics/getDecryptedEventsForDebug.action.ts
/**
 * @file getDecryptedEventsForDebug.action.ts
 * @description Server Action para obtener y desencriptar eventos.
 * @version 6.0.0 (Holistic Elite Leveling)
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

export async function getDecryptedEventsForDebugAction(
  input: GetDecryptedEventsInput
): Promise<ActionResult<{ events: AuraEventPayload[]; total: number }>> {
  const traceId = logger.startTrace("getDecryptedEventsAction_v6.0");
  logger.startGroup(`[Action] Obteniendo eventos desencriptados...`, traceId);

  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { campaignId, sessionId, limit = 20, page = 1 } = input;
    const offset = (page - 1) * limit;

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
    logger.traceEvent(traceId, `Se obtuvieron ${data.length} eventos encriptados.`);

    const decryptedEventsPromises = data.map(async (event: VisitorCampaignEventRow) => {
      try {
        if (!event.payload) throw new Error("Payload nulo.");
        const decryptedPayloadString = await decryptServerData(event.payload as string);
        const decryptedPayloadObject = JSON.parse(decryptedPayloadString);
        return mapSupabaseToAuraEventPayload(event, decryptedPayloadObject, traceId);
      } catch (decryptionError) {
        const errorMessage = decryptionError instanceof Error ? decryptionError.message : "Error desconocido.";
        logger.warn(`[Guardián] Fallo al procesar evento ${event.event_id}.`, { traceId, error: errorMessage });
        return null; // Marcar como nulo para filtrarlo después
      }
    });

    const decryptedEvents = (await Promise.all(decryptedEventsPromises))
      .filter((e): e is AuraEventPayload => e !== null);

    logger.success(`[Action] Se procesaron ${decryptedEvents.length} eventos válidos.`);
    return { success: true, data: { events: decryptedEvents, total: count ?? 0 } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener eventos.", { error: errorMessage, traceId });
    return { success: false, error: `No se pudieron obtener los eventos: ${errorMessage}` };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
