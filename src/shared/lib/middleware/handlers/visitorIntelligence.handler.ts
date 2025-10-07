// RUTA: src/shared/lib/middleware/handlers/visitorIntelligence.handler.ts
/**
 * @file visitorIntelligence.handler.ts
 * @description Manejador "Perfilador" de élite. Identifica y enriquece la petición
 *              del visitante. Es ultraligero y no realiza operaciones de persistencia.
 * @version 11.0.0 (Decoupled & High-Performance)
 * @author L.I.A. Legacy
 */
import "server-only";
import { createId } from "@paralleldrive/cuid2";
import { type MiddlewareHandler } from "../engine";
import { logger } from "../../logging";
import { KNOWN_BOTS } from "./config/known-bots";

const FINGERPRINT_COOKIE = "visitor_fingerprint";
const FINGERPRINT_MAX_AGE = 63072000; // 2 años

export const visitorIntelligenceHandler: MiddlewareHandler = async (
  req,
  res
) => {
  const traceId = logger.startTrace("visitorIntelligenceHandler_v11.0");

  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (KNOWN_BOTS.some((bot) => userAgent.toLowerCase().includes(bot))) {
      logger.trace("[VisitorInt Handler] Bot detectado. Omitiendo perfilado.", {
        traceId,
      });
      return res;
    }

    let fingerprint = req.cookies.get(FINGERPRINT_COOKIE)?.value;
    if (!fingerprint) {
      fingerprint = createId();
      // Se establece la cookie en la respuesta que se pasará al siguiente manejador
      res.cookies.set(FINGERPRINT_COOKIE, fingerprint, {
        path: "/",
        maxAge: FINGERPRINT_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    const ip = req.ip ?? "127.0.0.1";
    const geo = req.headers.get("x-vercel-ip-country") || "unknown";
    const referer = req.headers.get("referer") || "direct";

    // Enriquecer las cabeceras de la RESPUESTA para que el siguiente manejador
    // y la aplicación final (vía `headers()`) puedan acceder a los datos.
    res.headers.set("x-visitor-fingerprint", fingerprint);
    res.headers.set("x-visitor-ip", ip);
    res.headers.set("x-visitor-ua", userAgent);
    res.headers.set("x-visitor-geo", geo);
    res.headers.set("x-visitor-referer", referer);

    logger.trace(
      "[VisitorInt Handler] Cabeceras de respuesta enriquecidas con datos del visitante.",
      { traceId }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[VisitorInt Handler] Fallo en el perfilador Edge.", {
      error: errorMessage,
      traceId,
    });
  } finally {
    logger.endTrace(traceId);
  }

  // Se devuelve siempre la respuesta (modificada o no) para continuar el pipeline.
  return res;
};
