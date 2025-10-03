// RUTA: src/shared/lib/middleware/handlers/visitorIntelligence.handler.ts
/**
 * @file visitorIntelligence.handler.ts
 * @description Manejador "Perfilador Holístico" del pipeline, ahora con
 *              observabilidad de élite para mostrar datos brutos y mejorar la claridad.
 * @version 7.0.0 (Elite Observability & Raw Data Logging)
 * @author L.I.A. Legacy
 */
import "server-only";
import { UAParser } from "ua-parser-js";
import { getIpIntelligence } from "../../services/ip-intelligence.service";
import { type MiddlewareHandler } from "../engine";
import { logger } from "../../logging";
import { KNOWN_BOTS } from "./config/known-bots";
import { createId } from "@paralleldrive/cuid2";

const FINGERPRINT_COOKIE = "visitor_fingerprint";
const FINGERPRINT_MAX_AGE = 63072000; // 2 años

export const visitorIntelligenceHandler: MiddlewareHandler = async (
  req,
  res
) => {
  const traceId = logger.startTrace("visitorIntelligenceHandler_v7.0");
  logger.startGroup(
    `[VisitorInt Handler] Perfilando petición: ${req.nextUrl.pathname}`
  );

  try {
    const supabaseAuthCookie = req.cookies.get(
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL!.split(".")[0].split("//")[1]}-auth-token`
    );
    let fingerprint = req.cookies.get(FINGERPRINT_COOKIE)?.value;
    const identity = supabaseAuthCookie ? "identified" : "anonymous";

    const logContext: { fingerprint?: string; userId?: string } = {};

    if (identity === "anonymous") {
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
          `Nuevo visitante anónimo. Fingerprint generado: ${fingerprint}`
        );
      }
      logContext.fingerprint = fingerprint;
    } else {
      // Si está identificado, podemos intentar obtener el userId del token si fuera necesario para logs,
      // pero por ahora, solo confirmamos que no hay fingerprint.
    }

    logger.traceEvent(
      traceId,
      `Identidad del visitante: ${identity}`,
      logContext
    );

    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "direct";
    const vercelGeo = req.geo;

    // --- LOG DE DATOS BRUTOS ---
    logger.traceEvent(traceId, "Datos brutos de origen capturados:", {
      ip,
      userAgent,
      referer,
      vercelGeo: vercelGeo || "No disponible (local/dev)",
    });

    const lowerCaseUserAgent = userAgent.toLowerCase();
    const isBot = KNOWN_BOTS.some((bot) => lowerCaseUserAgent.includes(bot));
    const visitorType = isBot ? "bot" : "human";
    const uaResult = new UAParser(userAgent).getResult();
    const deviceType = uaResult.device.type || "desktop";

    logger.traceEvent(traceId, `User-Agent procesado.`, {
      type: visitorType,
      device: deviceType,
      browser: uaResult.browser.name,
      os: uaResult.os.name,
    });

    let country = "unknown",
      region = "unknown",
      city = "unknown",
      latitude = "unknown",
      longitude = "unknown",
      isProxy = false,
      source = "none";

    if (vercelGeo?.country) {
      country = vercelGeo.country;
      region = vercelGeo.region || "unknown";
      city = vercelGeo.city || "unknown";
      latitude = vercelGeo.latitude || "unknown";
      longitude = vercelGeo.longitude || "unknown";
      source = "Vercel Edge";
    } else if (!isBot) {
      const intelligence = await getIpIntelligence(ip);
      if (intelligence) {
        country = intelligence.countryCode || "unknown";
        region = intelligence.region || "unknown";
        city = intelligence.city || "unknown";
        latitude = String(intelligence.latitude || "unknown");
        longitude = String(intelligence.longitude || "unknown");
        isProxy = intelligence.isProxy || false;
        source = "ip-api.com (Fallback)";
      }
    }

    const headersToSet: Record<string, string> = {
      "x-visitor-identity": identity,
      "x-visitor-fingerprint": fingerprint || "none",
      "x-visitor-type": visitorType,
      "x-visitor-ip": ip,
      "x-visitor-country": country,
      "x-visitor-region": region,
      "x-visitor-city": city,
      "x-visitor-latitude": latitude,
      "x-visitor-longitude": longitude,
      "x-visitor-proxy": String(isProxy),
      "x-geoip-source": source,
      "x-visitor-user-agent": userAgent,
      "x-visitor-device-type": deviceType,
      "x-visitor-browser-name": uaResult.browser.name || "unknown",
      "x-visitor-browser-version": uaResult.browser.version || "unknown",
      "x-visitor-os-name": uaResult.os.name || "unknown",
      "x-visitor-os-version": uaResult.os.version || "unknown",
      "x-visitor-referer": referer,
      "x-visitor-accept-language":
        req.headers.get("accept-language") || "not_specified",
      "x-visitor-full-url": req.nextUrl.href,
      "x-vercel-id": req.headers.get("x-vercel-id") || "none",
    };

    for (const [key, value] of Object.entries(headersToSet)) {
      res.headers.set(key, value);
    }

    logger.success(
      `[VisitorInt Handler] Petición enriquecida con ${Object.keys(headersToSet).length} cabeceras.`,
      { traceId }
    );

    return res;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[VisitorInt Handler] Fallo crítico durante el perfilado.", {
      error: errorMessage,
      traceId,
    });
    return res;
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
};
