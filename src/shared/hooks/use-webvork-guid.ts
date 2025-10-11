// RUTA: src/shared/hooks/use-webvork-guid.ts
/**
 * @file use-webvork-guid.ts
 * @description Hook Atómico de Efecto para obtener el GUID de Webvork, ahora
 *              con seguridad de tipos absoluta mediante doble aserción,
 *              resolviendo el error TS2352.
 * @version 7.1.0 (Absolute Type Safety)
 * @author L.I.A. Legacy
 */
"use client";

import { useEffect, useRef } from "react";

import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";

// La interfaz permanece sin cambios, es correcta.
interface WindowWithJsonp extends Window {
  [key: string]: unknown;
}

const setCookie = (name: string, value: string, days = 30): void => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

export function useWebvorkGuid(enabled: boolean): void {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (!enabled || hasExecuted.current) {
      return;
    }

    const groupId = logger.startGroup(
      "[useWebvorkGuid] Orquestando inyección de script GUID."
    );
    try {
      const producerConfig = getProducerConfig();
      const { LANDING_ID, OFFER_ID } = producerConfig;

      if (!LANDING_ID || !OFFER_ID) {
        logger.warn(
          "LANDING_ID o OFFER_ID no configurados. Abortando llamada de GUID."
        );
        return;
      }

      logger.trace("Activado. Iniciando solicitud de GUID a Webvork...");

      const callbackName =
        "jsonp_callback_" + Math.round(100000 * Math.random());
      const scriptTagId = `script_${callbackName}`;

      // --- [INICIO DE REFACTORIZACIÓN DE TIPO v7.1.0] ---
      // Se aplica la doble aserción recomendada por el compilador.
      (window as unknown as WindowWithJsonp)[callbackName] = () => {
        // --- [FIN DE REFACTORIZACIÓN DE TIPO v7.1.0] ---
        const callbackGroupId = logger.startGroup(
          "Callback: Webvork GUID Recibido"
        );
        try {
          const guidFromHtml =
            document.documentElement.getAttribute("data-guid");
          if (guidFromHtml) {
            logger.info(
              `GUID confirmado desde atributo data-guid: ${guidFromHtml}`
            );
            setCookie("wv_guid", guidFromHtml, 30);
          } else {
            logger.warn(
              "Callback recibido, pero el atributo data-guid no fue encontrado."
            );
          }
        } catch (error) {
          logger.error("Error procesando callback de GUID.", { error });
        } finally {
          // --- [INICIO DE REFACTORIZACIÓN DE TIPO v7.1.0] ---
          // Se aplica la doble aserción aquí también.
          delete (window as unknown as WindowWithJsonp)[callbackName];
          // --- [FIN DE REFACTORIZACIÓN DE TIPO v7.1.0] ---
          const scriptElement = document.getElementById(scriptTagId);
          scriptElement?.remove();
          logger.endGroup(callbackGroupId);
        }
      };

      const trackerUrl = `//webvkrd.com/js.php?landing_id=${LANDING_ID}&offer_id=${OFFER_ID}&page_type=landing&callback=${callbackName}`;
      const scriptTag = document.createElement("script");
      scriptTag.id = scriptTagId;
      scriptTag.src = trackerUrl;
      scriptTag.async = true;
      document.body.appendChild(scriptTag);

      hasExecuted.current = true;
    } finally {
      logger.endGroup(groupId);
    }
  }, [enabled]);
}
