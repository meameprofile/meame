// RUTA: src/shared/hooks/use-yandex-metrika.ts
/**
 * @file use-yandex-metrika.ts
 * @description Hook Atómico de Efecto para el píxel de Yandex Metrika.
 *              v4.0.0 (Lazy Config Initialization): Refactorizado para importar y
 *              llamar a la función `getProducerConfig`, asegurando una inicialización
 *              diferida y segura de las variables de entorno. Cumple con los 5 Pilares.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef } from "react";

import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";

const YANDEX_SCRIPT_ID = "yandex-metrika-init";

export function useYandexMetrika(enabled: boolean): void {
  const hasExecuted = useRef(false);

  useEffect(() => {
    // Guardia de idempotencia y activación.
    if (!enabled || hasExecuted.current) {
      return;
    }

    // Obtención segura de la configuración.
    const producerConfig = getProducerConfig();
    const yandexId = producerConfig.TRACKING.YANDEX_METRIKA_ID;

    // Guardia de configuración.
    if (!yandexId) {
      logger.trace("[Yandex Metrika] ID no configurado. Omitiendo inyección.");
      return;
    }

    // Guardia de re-inyección.
    if (document.getElementById(YANDEX_SCRIPT_ID)) {
      return;
    }

    logger.info(`[Tracking] Inyectando Yandex Metrika con ID: ${yandexId}`);

    const ymScriptContent = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.com/metrika/tag.js", "ym");
      ym(${yandexId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
    `;

    const script = document.createElement("script");
    script.id = YANDEX_SCRIPT_ID;
    script.innerHTML = ymScriptContent;
    document.head.appendChild(script);

    hasExecuted.current = true;
  }, [enabled]);
}
