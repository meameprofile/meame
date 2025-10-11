// RUTA: src/app/api/aura/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint para la ingesta de eventos de "Aura", ahora con contratos
 *              soberanos, observabilidad de élite y trazabilidad de Vercel.
 * @version 7.0.0 (Observability Contract v20+ Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { NextResponse, type NextRequest } from "next/server";

import { logger } from "@/shared/lib/logging";
import type { AnonymousCampaignEventInsert } from "@/shared/lib/schemas/analytics/analytics.contracts";
import { AuraIngestPayloadSchema } from "@/shared/lib/schemas/analytics/aura.schema";
import type { Json } from "@/shared/lib/supabase/database.types";
import { createServerClient } from "@/shared/lib/supabase/server";
import { encryptServerData } from "@/shared/lib/utils/server-encryption";

export async function POST(request: NextRequest) {
  // Pilar III: Observabilidad de Élite con Tracing Holístico
  const vercelRequestId = request.headers.get("x-vercel-id");
  const traceId = logger.startTrace(
    `auraIngestEndpoint_v7.0:${vercelRequestId}`
  );
  const groupId = logger.startGroup(
    `[Aura Ingest] Procesando lote de eventos...`
  );

  try {
    const supabase = createServerClient();

    // Guardián de Contexto: Workspace ID es mandatorio
    const workspaceId = request.headers.get("x-workspace-id");
    if (!workspaceId) {
      logger.warn("[Aura Ingest] Petición recibida sin x-workspace-id.", {
        traceId,
      });
      return new NextResponse("Workspace ID is required", { status: 400 });
    }
    logger.traceEvent(
      traceId,
      `Petición recibida para workspace: ${workspaceId}`
    );

    const body = await request.json();

    // Guardián de Contrato: Validación de Payload
    const validation = AuraIngestPayloadSchema.safeParse(body);
    if (!validation.success) {
      logger.error("[Aura Ingest] Payload de ingestión inválido.", {
        errors: validation.error.flatten(),
        traceId,
      });
      return new NextResponse("Bad Request: Invalid payload", { status: 400 });
    }
    const { events } = validation.data;
    logger.traceEvent(
      traceId,
      `Payload validado. Procesando ${events.length} eventos.`
    );

    // Mapeo y Encriptación de Eventos
    const eventsToInsert: AnonymousCampaignEventInsert[] = await Promise.all(
      events.map(async (event) => {
        const encryptedPayload = await encryptServerData(
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
      })
    );
    logger.traceEvent(
      traceId,
      "Todos los payloads de eventos han sido encriptados."
    );

    // Persistencia en Base de Datos
    const { error } = await supabase
      .from("anonymous_campaign_events")
      .insert(eventsToInsert);

    if (error) {
      // Este error es crítico y debe ser investigado
      throw new Error(
        `Error de Supabase al insertar eventos: ${error.message}`
      );
    }

    logger.success(
      `[Aura Ingest] Lote de ${eventsToInsert.length} eventos persistido con éxito.`,
      { traceId }
    );
    return new NextResponse("Payload accepted", { status: 202 });
  } catch (error) {
    // Guardián de Resiliencia Holístico
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Aura Ingest] Fallo crítico en el endpoint de ingestión.", {
      error: errorMessage,
      traceId,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
