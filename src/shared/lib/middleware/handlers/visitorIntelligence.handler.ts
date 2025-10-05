// RUTA: src/shared/lib/middleware/handlers/visitorIntelligence.handler.ts
/**
 * @file visitorIntelligence.handler.ts
 * @description Manejador "Perfilador y Persistencia". No solo perfila, sino que
 *              persiste la sesión del visitante en la base de datos soberana.
 * @version 8.0.0 (Sovereign Persistence Engine)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { UAParser } from "ua-parser-js";
import { createId } from "@paralleldrive/cuid2";
import { createServerClient } from "@/shared/lib/supabase/server";
import { getIpIntelligence } from "../../services/ip-intelligence.service";
import { type MiddlewareHandler } from "../engine";
import { logger } from "../../logging";
import { KNOWN_BOTS } from "./config/known-bots";
import { encryptServerData } from "../../utils/server-encryption";
import type { VisitorSessionInsert } from "../../schemas/analytics/analytics.contracts";
import type { Json } from "../../supabase/database.types";

const FINGERPRINT_COOKIE = "visitor_fingerprint";
const FINGERPRINT_MAX_AGE = 63072000; // 2 años

export const visitorIntelligenceHandler: MiddlewareHandler = async (
  req,
  res
) => {
  const traceId = logger.startTrace("visitorIntelligenceHandler_v8.0");
  logger.startGroup(
    `[VisitorInt Handler] Perfilando y Persistiendo: ${req.nextUrl.pathname}`
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let fingerprint = req.cookies.get(FINGERPRINT_COOKIE)?.value;

    if (!fingerprint) {
      fingerprint = createId();
      res.cookies.set(FINGERPRINT_COOKIE, fingerprint, {
        path: "/",
        maxAge: FINGERPRINT_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      logger.traceEvent(
        traceId,
        `Nuevo visitante detectado. Fingerprint generado: ${fingerprint}`
      );
    } else {
      logger.traceEvent(
        traceId,
        `Visitante recurrente detectado. Fingerprint: ${fingerprint}`
      );
    }

    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const isBot = KNOWN_BOTS.some((bot) =>
      userAgent.toLowerCase().includes(bot)
    );

    if (isBot) {
      logger.info(
        "[VisitorInt Handler] Bot detectado. Omitiendo persistencia y enriquecimiento.",
        { userAgent, traceId }
      );
      // Retornamos la respuesta sin modificar para no procesar bots.
      return res;
    }

    logger.traceEvent(traceId, "Iniciando obtención de inteligencia de IP...");
    const geoIntelligence = await getIpIntelligence(ip);
    const uaResult = new UAParser(userAgent).getResult();
    logger.traceEvent(
      traceId,
      "Inteligencia de IP y User-Agent obtenida. Procediendo a encriptar."
    );

    const [ip_address_encrypted, user_agent_encrypted, geo_encrypted] =
      await Promise.all([
        encryptServerData(ip),
        encryptServerData(JSON.stringify(uaResult)),
        geoIntelligence
          ? encryptServerData(JSON.stringify(geoIntelligence))
          : Promise.resolve(null),
      ]);

    const sessionPayload: VisitorSessionInsert = {
      session_id: fingerprint,
      fingerprint_id: fingerprint,
      user_id: user?.id || null,
      ip_address_encrypted,
      user_agent_encrypted,
      geo_encrypted: geo_encrypted as Json,
      last_seen_at: new Date().toISOString(),
    };

    logger.traceEvent(
      traceId,
      "Payload de sesión listo. Ejecutando 'upsert' en Supabase..."
    );
    const { error } = await supabase
      .from("visitor_sessions")
      .upsert(sessionPayload, { onConflict: "session_id" });

    if (error) {
      // Este guardián previene que un fallo en la DB interrumpa la solicitud.
      throw new Error(
        `Fallo de Supabase al persistir sesión: ${error.message}`
      );
    }
    logger.success(
      `[VisitorInt Handler] Sesión ${fingerprint} persistida/actualizada con éxito.`,
      { traceId }
    );

    // El enriquecimiento de cabeceras sigue siendo crucial para los manejadores posteriores
    res.headers.set("x-visitor-fingerprint", fingerprint);
    res.headers.set(
      "x-visitor-country",
      geoIntelligence?.countryCode || "unknown"
    );
    logger.traceEvent(
      traceId,
      "Cabeceras de respuesta enriquecidas para el siguiente manejador en el pipeline."
    );

    return res;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[VisitorInt Handler] Fallo crítico durante el perfilado y persistencia.",
      { error: errorMessage, traceId }
    );
    // Pilar de Resiliencia: En caso de error, no interrumpimos la solicitud.
    // Simplemente no se persistirá la sesión, pero el usuario podrá ver la página.
    return res;
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
};
