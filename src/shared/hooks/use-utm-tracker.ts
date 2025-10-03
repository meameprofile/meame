// src/hooks/tracking/useUtmTracker.ts
/**
 * @file useUtmTracker.ts
 * @description Hook Atómico de Efecto. Captura parámetros UTM y los persiste en cookies.
 *              Diseñado para ser activado una sola vez por un hook orquestador.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef } from "react";
import { logger } from "@/shared/lib/logging";

// --- Constantes y Tipos ---
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
type UtmParam = (typeof UTM_PARAMS)[number];

// --- Helpers Puros (Optimizados fuera del hook) ---
const getParamFromUrl = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

/**
 * @function useUtmTracker
 * @description Lee los parámetros UTM de la URL y los guarda en cookies.
 *              Se ejecuta una sola vez cuando el parámetro 'enabled' pasa a ser true.
 * @param {boolean} enabled - El interruptor de activación proporcionado por el orquestador.
 */
export function useUtmTracker(enabled: boolean): void {
  const hasExecuted = useRef(false);

  useEffect(() => {
    // El hook solo se ejecuta si está habilitado Y no se ha ejecutado antes.
    if (!enabled || hasExecuted.current) {
      return;
    }

    logger.startGroup("Hook: useUtmTracker");
    logger.trace("Activado. Rastreando parâmetros UTM na URL...");

    const collectedParams: Partial<Record<UtmParam, string>> = {};

    UTM_PARAMS.forEach((paramName) => {
      const value = getParamFromUrl(paramName);
      if (value) {
        collectedParams[paramName] = value;
        setCookie(`wv_${paramName}`, value);
      }
    });

    if (Object.keys(collectedParams).length > 0) {
      logger.info(
        "Parámetros UTM capturados y persistidos en cookies.",
        collectedParams
      );
    } else {
      logger.trace("No se encontraron parámetros UTM en la URL.");
    }

    // Marcamos como ejecutado para prevenir futuras ejecuciones.
    hasExecuted.current = true;
    logger.endGroup();
  }, [enabled]); // La única dependencia es el interruptor de activación.
}
// src/hooks/tracking/useUtmTracker.ts
