// RUTA: src/app/api/nos3/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de Ingestión soberano y transaccional para el sistema `nos3`.
 *              v2.2.0 (Type Integrity Restoration): Se corrige la lógica de asignación
 *              de promesas para resolver los errores de tipo TS2322 y garantizar la
 *              seguridad de tipos absoluta en el manejo de datos encriptados.
 * @version 2.2.0
 * @author L.I.A. Legacy - Asistente de Refactorización
 */
import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";
import { getIpIntelligence } from "@/shared/lib/services/ip-intelligence.service";
import { encryptServerData } from "@/shared/lib/utils/server-encryption";
import type { VisitorSessionInsert } from "@/shared/lib/schemas/analytics/analytics.contracts";
import type { Json } from "@/shared/lib/supabase/database.types";

export const runtime = "nodejs"; // Se requiere Node.js para las operaciones de criptografía.

const Nos3IngestPayloadSchema = z.object({
  events: z.array(z.any()),
  metadata: z.object({
    pathname: z.string(),
    timestamp: z.number(),
  }),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const taskId = logger.startTask(
    { domain: "AURA_NOS3", entity: "SESSION_RECORDING", action: "INGEST" },
    "Ingesting Nos3 Session Recording"
  );
  let finalStatus: "SUCCESS" | "FAILURE" = "SUCCESS";
  let blobPath: string | null = null;

  try {
    // --- PASO 1: VALIDACIÓN Y EXTRACCIÓN DE DATOS ---
    logger.taskStep(taskId, "EXTRACT_AND_VALIDATE", "IN_PROGRESS");
    const body = await request.json();
    const validation = Nos3IngestPayloadSchema.safeParse(body);

    const fingerprint = request.headers.get("x-visitor-fingerprint");
    const ip = request.headers.get("x-visitor-ip");
    const uaString = request.headers.get("x-visitor-ua");
    const userId = request.headers.get("x-user-id") || null;

    if (!validation.success || !fingerprint || !ip || !uaString) {
      finalStatus = "FAILURE";
      logger.taskStep(taskId, "EXTRACT_AND_VALIDATE", "FAILURE", {
        error: "Payload o cabeceras requeridas ausentes.",
        validationErrors: validation.success
          ? null
          : validation.error.flatten(),
      });
      return new NextResponse("Bad Request: Payload o cabeceras inválidas.", {
        status: 400,
      });
    }
    const { events, metadata } = validation.data;
    logger.taskStep(taskId, "EXTRACT_AND_VALIDATE", "SUCCESS");

    // --- PASO 2: PERSISTENCIA DE LA SESIÓN (TRANSACCIÓN - PARTE 1) ---
    logger.taskStep(taskId, "PERSIST_SESSION", "IN_PROGRESS");
    const supabase = createServerClient();

    // --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE TIPOS v2.2.0] ---
    // Primero, obtenemos los objetos de datos crudos.
    const [geoIntelligence, uaResult] = await Promise.all([
      getIpIntelligence(ip),
      new UAParser(uaString).getResult(),
    ]);

    // Luego, en un segundo paso, realizamos las operaciones de encriptación.
    const [encryptedIp, encryptedUa, encryptedGeo] = await Promise.all([
      encryptServerData(ip),
      encryptServerData(JSON.stringify(uaResult)),
      geoIntelligence ? encryptServerData(JSON.stringify(geoIntelligence)) : null,
    ]);
    // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE TIPOS v2.2.0] ---

    const sessionPayload: VisitorSessionInsert = {
      session_id: fingerprint,
      fingerprint_id: fingerprint,
      user_id: userId,
      ip_address_encrypted: encryptedIp,
      user_agent_encrypted: encryptedUa,
      geo_encrypted: encryptedGeo as Json,
      last_seen_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("visitor_sessions")
      .upsert(sessionPayload, { onConflict: "session_id" });

    if (upsertError) {
      throw new Error(`Fallo en Supabase upsert: ${upsertError.message}`);
    }
    logger.taskStep(taskId, "PERSIST_SESSION", "SUCCESS");

    // --- PASO 3: SUBIDA DE LA GRABACIÓN (TRANSACCIÓN - PARTE 2) ---
    logger.taskStep(taskId, "UPLOAD_RECORDING", "IN_PROGRESS");
    blobPath = `sessions/${fingerprint}/${metadata.timestamp}.json`;
    await put(blobPath, JSON.stringify(events), {
      access: "public",
      contentType: "application/json",
    });
    logger.taskStep(taskId, "UPLOAD_RECORDING", "SUCCESS");

    return new NextResponse("Payload accepted and processed.", { status: 202 });
  } catch (error) {
    finalStatus = "FAILURE";
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Nos3 Ingest] Fallo crítico durante la ingestión transaccional.",
      { error: errorMessage, taskId }
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    logger.endTask(taskId, finalStatus);
  }
}
