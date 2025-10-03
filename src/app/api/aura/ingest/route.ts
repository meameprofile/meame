// RUTA: src/app/api/aura/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de API para la ingesta de eventos de "Aura".
 *              v3.0.0 (Runtime Integrity Restoration): Se elimina la directiva 'edge'
 *              para restaurar la compatibilidad con el runtime de Node.js,
 *              necesario para las operaciones de encriptación (crypto).
 * @version 3.0.0
 * @author L.I.A. Legacy
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { AuraIngestPayloadSchema } from "@/shared/lib/schemas/analytics/aura.schema";
import { encryptServerData } from "@/shared/lib/utils/server-encryption";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La directiva 'export const runtime = "edge";' ha sido eliminada.
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export async function POST(request: NextRequest) {
  const traceId = logger.startTrace("auraIngestEndpoint_v3.0_Node");
  logger.info("[Aura Ingest] Evento entrante recibido...", { traceId });

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const workspaceId = request.headers.get("x-workspace-id");

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = AuraIngestPayloadSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }

    const eventsToInsert = validation.data.events.map((event) => {
      const encryptedPayload = encryptServerData(JSON.stringify(event.payload));
      return {
        session_id: event.sessionId,
        user_id: user?.id || null,
        workspace_id: workspaceId,
        campaign_id: event.campaignId,
        variant_id: event.variantId,
        event_type: event.eventType,
        payload: encryptedPayload,
        created_at: new Date(event.timestamp).toISOString(),
      };
    });

    const { error } = await supabase
      .from("anonymous_campaign_events")
      .insert(eventsToInsert);

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return new NextResponse("Payload accepted", { status: 202 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("[Aura Ingest] Fallo crítico en el endpoint de ingesta.", {
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endTrace(traceId);
  }
}
