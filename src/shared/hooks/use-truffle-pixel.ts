// RUTA: src/shared/hooks/use-truffle-pixel.ts
/**
 * @file use-truffle-pixel.ts
 * @description Hook Atómico de Efecto para el píxel de Truffle.bid.
 *              v4.0.0 (Lazy Config Initialization): Refactorizado para adherirse
 *              al contrato de `getProducerConfig`, garantizando una carga
 *              segura y diferida de las variables de entorno. Cumple con los 5 Pilares.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef } from "react";
import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";

const TRUFFLE_SCRIPT_ID = "truffle-pixel-init";

export function useTrufflePixel(enabled: boolean): void {
  const hasExecuted = useRef(false);

  useEffect(() => {
    // Guardia de idempotencia y activación.
    if (!enabled || hasExecuted.current) {
      return;
    }

    // Obtención segura de la configuración.
    const producerConfig = getProducerConfig();
    const truffleId = producerConfig.TRACKING.TRUFFLE_PIXEL_ID;

    // Guardia de configuración.
    if (!truffleId) {
      logger.trace("[Truffle Pixel] ID no configurado. Omitiendo inyección.");
      return;
    }

    // Guardia de re-inyección.
    if (document.getElementById(TRUFFLE_SCRIPT_ID)) {
      return;
    }

    logger.info(`[Tracking] Inyectando Truffle.bid con ID: ${truffleId}`);

    const script = document.createElement("script");
    script.id = TRUFFLE_SCRIPT_ID;
    script.innerHTML = `
      !function (p,i,x,e,l,j,s) {p[l] = p[l] || function (pixelId) {p[l].pixelId = pixelId};j = i.createElement(x), s = i.getElementsByTagName(x)[0], j.async = 1, j.src = e, s.parentNode.insertBefore(j, s)}(window, document, "script", "https://cdn.truffle.bid/p/inline-pixel.js", "ttf");
      ttf("${truffleId}");
    `;
    document.head.appendChild(script);

    hasExecuted.current = true;
  }, [enabled]);
}
