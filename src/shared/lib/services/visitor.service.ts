// RUTA: src/shared/lib/services/visitor.service.ts
/**
 * @file visitor.service.ts
 * @description Servicio de servidor soberano para la persistencia de la inteligencia de visitantes.
 *              Contiene la lógica "pesada" que requiere el runtime de Node.js.
 * @version 1.1.0 (Observability Contract Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { UAParser } from "ua-parser-js";

import { createServerClient } from "@/shared/lib/supabase/server";

import { logger } from "../logging";
import type { VisitorSessionInsert } from "../schemas/analytics/analytics.contracts";
import type { Json } from "../supabase/database.types";
import { encryptServerData } from "../utils/server-encryption";

import { getIpIntelligence } from "./ip-intelligence.service";

interface VisitorData {
  fingerprint: string;
  ip: string;
  userAgent: string;
  userId: string | null;
}

export async function persistVisitorIntelligence(
  data: VisitorData
): Promise<void> {
  const traceId = logger.startTrace("persistVisitorIntelligence");
  const groupId = logger.startGroup(
    "[Visitor Service] Persistiendo datos de sesión...",
    traceId
  );

  try {
    const { fingerprint, ip, userAgent, userId } = data;

    const [geoIntelligence, uaResult] = await Promise.all([
      getIpIntelligence(ip),
      new UAParser(userAgent).getResult(),
    ]);

    const [ip_address_encrypted, user_agent_encrypted, geo_encrypted] =
      await Promise.all([
        encryptServerData(ip),
        encryptServerData(JSON.stringify(uaResult)),
        geoIntelligence
          ? encryptServerData(JSON.stringify(geoIntelligence))
          : null,
      ]);

    const sessionPayload: VisitorSessionInsert = {
      session_id: fingerprint,
      fingerprint_id: fingerprint,
      user_id: userId,
      ip_address_encrypted,
      user_agent_encrypted,
      geo_encrypted: geo_encrypted as Json,
      last_seen_at: new Date().toISOString(),
    };

    const supabase = createServerClient();
    const { error } = await supabase
      .from("visitor_sessions")
      .upsert(sessionPayload, { onConflict: "session_id" });

    if (error) throw error;

    logger.success(
      `[Visitor Service] Sesión ${fingerprint} persistida con éxito.`,
      { traceId }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Visitor Service] Fallo crítico al persistir la sesión.", {
      error: errorMessage,
      traceId,
    });
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
