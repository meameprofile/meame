// RUTA: src/shared/hooks/use-google-analytics.ts
/**
 * @file use-google-analytics.ts
 * @description Hook Atómico de Efecto para el píxel de Google Analytics.
 * @version 4.0.0 (Resilient & Production Ready)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef } from "react";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Se importa la función en lugar de la constante para una inicialización diferida y segura.
import { getProducerConfig } from "@/shared/lib/config/producer.config";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
import { logger } from "@/shared/lib/logging";

const GA_REMOTE_SCRIPT_ID = "google-analytics-gtag";
const GA_INIT_SCRIPT_ID = "google-analytics-init";

export function useGoogleAnalytics(enabled: boolean): void {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (!enabled || hasExecuted.current) {
      return;
    }

    // Se invoca la función para obtener la configuración de forma segura.
    const producerConfig = getProducerConfig();
    const gaId = producerConfig.TRACKING.GOOGLE_ANALYTICS_ID;

    if (!gaId) {
      return; // Falla silenciosamente si el ID no está configurado.
    }

    if (
      document.getElementById(GA_REMOTE_SCRIPT_ID) ||
      document.getElementById(GA_INIT_SCRIPT_ID)
    ) {
      return; // Evita la reinyección.
    }

    logger.info(`[Tracking] Inyectando Google Analytics con ID: ${gaId}`);

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
  }, [enabled]);
}
