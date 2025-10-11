// RUTA: src/shared/hooks/use-google-analytics.ts
/**
 * @file use-google-analytics.ts
 * @description Hook Atómico de Efecto para el píxel de Google Analytics.
 * @version 5.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useMemo } from "react";

import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";

const GA_REMOTE_SCRIPT_ID = "google-analytics-gtag";
const GA_INIT_SCRIPT_ID = "google-analytics-init";

export function useGoogleAnalytics(enabled: boolean): void {
  const traceId = useMemo(
    () => logger.startTrace("useGoogleAnalytics_v5.0"),
    []
  );
  const hasExecuted = useRef(false);

  useEffect(() => {
    logger.info(
      `[GoogleAnalytics] Hook montado. Estado: ${enabled ? "HABILITADO" : "DESHABILITADO"}.`,
      { traceId }
    );

    if (!enabled) {
      logger.traceEvent(traceId, "Tracker deshabilitado, omitiendo ejecución.");
      return;
    }
    if (hasExecuted.current) {
      logger.traceEvent(
        traceId,
        "El script ya fue inyectado, omitiendo ejecución."
      );
      return;
    }

    const producerConfig = getProducerConfig();
    const gaId = producerConfig.TRACKING.GOOGLE_ANALYTICS_ID;

    if (!gaId) {
      logger.warn(
        "[Guardián] ID de Google Analytics no configurado. Omitiendo inyección.",
        { traceId }
      );
      return;
    }

    if (
      document.getElementById(GA_REMOTE_SCRIPT_ID) ||
      document.getElementById(GA_INIT_SCRIPT_ID)
    ) {
      logger.warn(
        "[Guardián] Los scripts de Google Analytics ya existen en el DOM. Omitiendo re-inyección.",
        { traceId }
      );
      hasExecuted.current = true;
      return;
    }

    logger.success(`[Tracking] Inyectando Google Analytics con ID: ${gaId}`, {
      traceId,
    });

    const remoteScript = document.createElement("script");
    remoteScript.id = GA_REMOTE_SCRIPT_ID;
    remoteScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    remoteScript.async = true;
    document.head.appendChild(remoteScript);

    const initScript = document.createElement("script");
    initScript.id = GA_INIT_SCRIPT_ID;
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(initScript);

    hasExecuted.current = true;
    logger.traceEvent(traceId, "Inyección de scripts completada.");

    return () => logger.endTrace(traceId);
  }, [enabled, traceId]);
}
