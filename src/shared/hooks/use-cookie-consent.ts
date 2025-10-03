// RUTA: src/shared/hooks/use-cookie-consent.ts
/**
 * @file use-cookie-consent.ts
 * @description Hook soberano para gestionar el estado del consentimiento de cookies.
 *              Es SSR-safe y cumple con los 5 Pilares de Calidad.
 * @version 2.0.0 (Elite & FSD Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
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
  // Pilar III (Observabilidad): Se añade un log de traza en la inicialización.
  logger.trace("[useCookieConsent] Hook de consentimiento inicializado.");

  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [hasBeenSet, setHasBeenSet] = useState(true);

  useEffect(() => {
    try {
      const storedStatus = window.localStorage.getItem(
        CONSENT_STORAGE_KEY
      ) as ConsentStatus | null;
      if (storedStatus) {
        setStatus(storedStatus);
        setHasBeenSet(true);
      } else {
        setHasBeenSet(false);
      }
    } catch (error) {
      // Pilar III (Observabilidad): Se utiliza el logger soberano.
      logger.error(
        "Fallo al leer el consentimiento de cookies del localStorage",
        { error }
      );
      setHasBeenSet(false);
    }
  }, []);

  const accept = useCallback(() => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
      setStatus("accepted");
      setHasBeenSet(true);
      logger.success(
        "[useCookieConsent] Consentimiento ACEPTADO y persistido."
      );
    } catch (error) {
      // Pilar III (Observabilidad): Se utiliza el logger soberano.
      logger.error(
        "Fallo al guardar el consentimiento de cookies en localStorage",
        { error }
      );
    }
  }, []);

  const reject = useCallback(() => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "rejected");
      setStatus("rejected");
      setHasBeenSet(true);
      logger.warn("[useCookieConsent] Consentimiento RECHAZADO y persistido.");
    } catch (error) {
      // Pilar III (Observabilidad): Se utiliza el logger soberano.
      logger.error(
        "Fallo al guardar el consentimiento de cookies en localStorage",
        { error }
      );
    }
  }, []);

  return { status, hasBeenSet, accept, reject };
}
