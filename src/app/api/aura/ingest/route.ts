// RUTA: src/app/api/aura/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint para la ingesta de eventos de "Aura", ahora con contratos
 *              soberanos, observabilidad de élite y trazabilidad de Vercel.
 * @version 6.0.0 (Sovereign Contract & Vercel Traceability)
 * @author L.I.A. Legacy
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { AuraIngestPayloadSchema } from "@/shared/lib/schemas/analytics/aura.schema";
import { encryptServerData } from "@/shared/lib/utils/server-encryption";
import type { Json } from "@/shared/lib/supabase/database.types";
import type { AnonymousCampaignEventInsert } from "@/shared/lib/schemas/analytics/analytics.contracts";

export async function POST(request: NextRequest) {
  const vercelRequestId = request.headers.get("x-vercel-id");
  const traceId = logger.startTrace(
    `auraIngestEndpoint_v6.0:${vercelRequestId}`
  );
  logger.startGroup(`[Aura Ingest] Procesando lote de eventos...`);

  try {
    const supabase = createServerClient();
    const workspaceId = request.headers.get("x-workspace-id");
    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = AuraIngestPayloadSchema.safeParse(body);
    if (!validation.success) {
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }

    const eventsToInsert: AnonymousCampaignEventInsert[] =
      validation.data.events.map((event) => {
        const encryptedPayload = encryptServerData(
          JSON.stringify(event.payload)
        );
        return {
          fingerprint_id: event.sessionId,
          session_id: event.sessionId,
          workspace_id: workspaceId,
          campaign_id: event.campaignId,
          variant_id: event.variantId,
          event_type: event.eventType,
          payload: encryptedPayload as Json,
          created_at: new Date(event.timestamp).toISOString(),
        };
      });

    const { error } = await supabase
      .from("anonymous_campaign_events")
      .insert(eventsToInsert);
    if (error) throw new Error(`Supabase insert error: ${error.message}`);

    logger.success(
      `[Aura Ingest] Lote de ${eventsToInsert.length} eventos persistido.`,
      { traceId }
    );
    return new NextResponse("Payload accepted", { status: 202 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logger.error("[Aura Ingest] Fallo crítico.", { error: msg, traceId });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
