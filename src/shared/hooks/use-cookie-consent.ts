// RUTA: src/shared/hooks/use-cookie-consent.ts
/**
 * @file use-cookie-consent.ts
 * @description Hook soberano para gestionar el estado del consentimiento de cookies.
 * @version 3.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/shared/lib/logging";

const CONSENT_STORAGE_KEY = "cookie_consent_status";
type ConsentStatus = "pending" | "accepted" | "rejected";

interface CookieConsentState {
  status: ConsentStatus;
  hasBeenSet: boolean;
  accept: () => void;
  reject: () => void;
}

export function useCookieConsent(): CookieConsentState {
  const traceId = useMemo(() => logger.startTrace("useCookieConsent_v3.0"), []);
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [hasBeenSet, setHasBeenSet] = useState(true);

  useEffect(() => {
    logger.info("[CookieConsent] Hook montado, leyendo estado.", { traceId });
    try {
      const storedStatus = window.localStorage.getItem(
        CONSENT_STORAGE_KEY
      ) as ConsentStatus | null;
      if (storedStatus) {
        setStatus(storedStatus);
        setHasBeenSet(true);
        logger.traceEvent(
          traceId,
          `Estado de consentimiento cargado desde localStorage: ${storedStatus}`
        );
      } else {
        setHasBeenSet(false);
        logger.traceEvent(
          traceId,
          "No se encontró estado de consentimiento, se solicitará."
        );
      }
    } catch (error) {
      logger.error(
        "[Guardián] Fallo al leer consentimiento del localStorage.",
        { error, traceId }
      );
      setHasBeenSet(false);
    }
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const setConsent = useCallback(
    (newStatus: "accepted" | "rejected") => {
      try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, newStatus);
        setStatus(newStatus);
        setHasBeenSet(true);
        logger.success(
          `[CookieConsent] Consentimiento ${newStatus.toUpperCase()} y persistido.`,
          { traceId }
        );
      } catch (error) {
        logger.error(
          "[Guardián] Fallo al guardar consentimiento en localStorage.",
          { error, traceId }
        );
      }
    },
    [traceId]
  );

  const accept = useCallback(() => setConsent("accepted"), [setConsent]);
  const reject = useCallback(() => setConsent("rejected"), [setConsent]);

  return { status, hasBeenSet, accept, reject };
}
