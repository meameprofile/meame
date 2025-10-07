// RUTA: src/shared/hooks/use-truffle-pixel.ts
/**
 * @file use-truffle-pixel.ts
 * @description Hook Atómico de Efecto para el píxel de Truffle.bid.
 * @version 5.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useMemo } from "react";
import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";

const TRUFFLE_SCRIPT_ID = "truffle-pixel-init";

export function useTrufflePixel(enabled: boolean): void {
  const traceId = useMemo(() => logger.startTrace("useTrufflePixel_v5.0"), []);
  const hasExecuted = useRef(false);

  useEffect(() => {
    logger.info(
      `[Truffle Pixel] Hook montado. Estado: ${enabled ? "HABILITADO" : "DESHABILITADO"}.`,
      { traceId }
    );

    if (!enabled || hasExecuted.current) {
      if (!enabled)
        logger.traceEvent(traceId, "Tracker deshabilitado, omitiendo.");
      return;
    }

    const producerConfig = getProducerConfig();
    const truffleId = producerConfig.TRACKING.TRUFFLE_PIXEL_ID;

    if (!truffleId) {
      logger.warn("[Guardián] ID de Truffle Pixel no configurado. Omitiendo.", {
        traceId,
      });
      return;
    }

    if (document.getElementById(TRUFFLE_SCRIPT_ID)) {
      hasExecuted.current = true;
      logger.warn(
        "[Guardián] Script de Truffle ya existe. Omitiendo re-inyección.",
        { traceId }
      );
      return;
    }

    logger.success(`[Tracking] Inyectando Truffle.bid con ID: ${truffleId}`, {
      traceId,
    });

    const script = document.createElement("script");
    script.id = TRUFFLE_SCRIPT_ID;
    script.innerHTML = `
      !function (p,i,x,e,l,j,s) {p[l] = p[l] || function (pixelId) {p[l].pixelId = pixelId};j = i.createElement(x), s = i.getElementsByTagName(x)[0], j.async = 1, j.src = e, s.parentNode.insertBefore(j, s)}(window, document, "script", "https://cdn.truffle.bid/p/inline-pixel.js", "ttf");
      ttf("${truffleId}");
    `;
    document.head.appendChild(script);

    hasExecuted.current = true;
    logger.traceEvent(traceId, "Inyección de script completada.");

    return () => logger.endTrace(traceId);
  }, [enabled, traceId]);
}
