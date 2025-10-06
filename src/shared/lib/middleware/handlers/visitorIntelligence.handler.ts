// RUTA: src/shared/lib/middleware/handlers/visitorIntelligence.handler.ts
/**
 * @file visitorIntelligence.handler.ts
 * @description Manejador "Perfilador y Persistencia". Identifica, enriquece y
 *              persiste los datos del visitante en segundo plano.
 * @version 10.0.0 (Holistic Persistence & Elite Compliance)
 * @author L.I.A. Legacy
 */
import "server-only";
import { createId } from "@paralleldrive/cuid2";
import { type MiddlewareHandler } from "../engine";
import { logger } from "../../logging";
import { KNOWN_BOTS } from "./config/known-bots";
import { persistVisitorIntelligence } from "../../services/visitor.service";

const FINGERPRINT_COOKIE = "visitor_fingerprint";
const FINGERPRINT_MAX_AGE = 63072000; // 2 años

export const visitorIntelligenceHandler: MiddlewareHandler = async (
  req,
  res
) => {
  const traceId = logger.startTrace("visitorIntelligenceHandler_v10.0");

  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (KNOWN_BOTS.some((bot) => userAgent.toLowerCase().includes(bot))) {
      return res; // No procesar bots
    }

    let fingerprint = req.cookies.get(FINGERPRINT_COOKIE)?.value;
    if (!fingerprint) {
      fingerprint = createId();
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

    // Enriquecer las cabeceras de la RESPUESTA para el pipeline y la APP
    res.headers.set("x-visitor-fingerprint", fingerprint);
    res.headers.set("x-visitor-ip", ip);
    res.headers.set("x-visitor-ua", userAgent);
    res.headers.set("x-visitor-geo", geo);
    res.headers.set("x-visitor-referer", referer);

    logger.trace("[VisitorInt Handler] Cabeceras de respuesta enriquecidas.", {
      traceId,
    });

    // --- LÓGICA DE PERSISTENCIA MOVILIZADA AQUÍ ---
    // Se ejecuta de forma asíncrona ("fire-and-forget") para no bloquear
    // el pipeline del middleware, pero se inicia desde el contexto correcto.
    persistVisitorIntelligence({
      fingerprint,
      ip,
      userAgent,
      // userId se determinará dentro del servicio con su propio cliente de Supabase
      userId: null,
    }).catch((e) => {
      logger.error(
        "[VisitorInt Handler] Fallo en la persistencia en segundo plano.",
        { error: e, traceId }
      );
    });
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

  return res; // Siempre devuelve la respuesta para no bloquear el pipeline
};
