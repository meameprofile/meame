// RUTA: src/shared/hooks/use-producer-logic.ts
/**
 * @file use-producer-logic.ts
 * @description Hook Soberano Orquestador para toda la lógica de tracking del productor.
 *              Gestiona el consentimiento, la interacción del usuario y la activación
 *              diferida de todos los hooks de tracking atómicos. Cumple con los
 *              5 Pilares de Calidad de la Directiva 026.
 * @version 7.0.0 (Holistic Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect } from "react";
import { logger } from "@/shared/lib/logging";
import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { useCookieConsent } from "@/shared/hooks/use-cookie-consent";
import { useUtmTracker } from "@/shared/hooks/use-utm-tracker";
import { useYandexMetrika } from "@/shared/hooks/use-yandex-metrika";
import { useGoogleAnalytics } from "@/shared/hooks/use-google-analytics";
import { useTrufflePixel } from "@/shared/hooks/use-truffle-pixel";
import { useWebvorkGuid } from "@/shared/hooks/use-webvork-guid";
import { useNos3Tracker } from "@/shared/hooks/use-nos3-tracker";

export function useProducerLogic(): void {
  // 1. Obtener configuración y estado de consentimiento
  const producerConfig = getProducerConfig();
  const { status: consentStatus } = useCookieConsent();
  const [hasInteracted, setHasInteracted] = useState(false);

  // 2. Lógica de activación por interacción del usuario
  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      logger.info(
        "[ProducerLogic] Interacción de usuario detectada. El tracking ahora es elegible para activación."
      );
      setHasInteracted(true);
      // Limpiar los listeners una vez que la interacción ha ocurrido
      eventListeners.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };

    const eventListeners: (keyof WindowEventMap)[] = [
      "mousedown",
      "touchstart",
      "keydown",
      "scroll",
    ];

    eventListeners.forEach((event) =>
      window.addEventListener(event, handleInteraction, {
        once: true,
        passive: true,
      })
    );

    return () =>
      eventListeners.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
  }, [hasInteracted]);

  // 3. Determinar el estado final de activación del tracking
  const canInitializeTracking =
    producerConfig.TRACKING_ENABLED && consentStatus === "accepted";
  const shouldInitialize = canInitializeTracking && hasInteracted;

  // 4. Observabilidad del estado del orquestador
  useEffect(() => {
    logger.startGroup("[ProducerLogic Orchestrator]");
    if (!producerConfig.TRACKING_ENABLED) {
      logger.warn(
        "Estado: Inactivo. Razón: Deshabilitado globalmente en `.env.local`."
      );
    } else if (consentStatus === "rejected") {
      logger.info(
        "Estado: Inactivo. Razón: El usuario ha rechazado las cookies."
      );
    } else if (consentStatus === "pending") {
      logger.info(
        "Estado: Pendiente. Razón: Esperando consentimiento del usuario."
      );
    } else if (!hasInteracted) {
      logger.info(
        "Estado: Pendiente. Razón: Consentimiento aceptado, esperando interacción del usuario."
      );
    } else {
      logger.success(
        "Estado: Activo. Todas las condiciones cumplidas. Inicializando hooks de tracking..."
      );
    }
    logger.endGroup();
  }, [consentStatus, hasInteracted, producerConfig.TRACKING_ENABLED]);

  // 5. Invocación condicional de los hooks de tracking atómicos
  useUtmTracker(shouldInitialize);
  useYandexMetrika(shouldInitialize);
  useGoogleAnalytics(shouldInitialize);
  useTrufflePixel(shouldInitialize);
  useWebvorkGuid(shouldInitialize);
  useNos3Tracker(shouldInitialize);
}
