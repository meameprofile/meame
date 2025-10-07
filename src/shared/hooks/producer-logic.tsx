// RUTA: src/shared/hooks/producer-logic.tsx
/**
 * @file producer-logic.tsx
 * @description Orquestador de lógica de tracking, con integridad de build restaurada.
 * @version 10.1.0 (Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState } from "react";
import { logger } from "@/shared/lib/logging";
import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { useCookieConsent } from "@/shared/hooks/use-cookie-consent";
import { useUtmTracker } from "@/shared/hooks/use-utm-tracker";
import { useYandexMetrika } from "@/shared/hooks/use-yandex-metrika";
import { useGoogleAnalytics } from "@/shared/hooks/use-google-analytics";
import { useTrufflePixel } from "@/shared/hooks/use-truffle-pixel";
import { useWebvorkGuid } from "@/shared/hooks/use-webvork-guid";
import { useNos3Tracker } from "@/shared/hooks/use-nos3-tracker";
import { useExecutionGuard } from "./useExecutionGuard";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se importa DeveloperErrorDisplay directamente desde su archivo soberano.
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export function ProducerLogicWrapper(): React.ReactElement | null {
  const [hasInteracted, setHasInteracted] = useState(false);
  const producerConfig = getProducerConfig();
  const { status: consentStatus } = useCookieConsent();

  const { error } = useExecutionGuard({
    name: "ProducerLogic Interaction Listener",
    dependencies: [hasInteracted],
    callback: () => {
      if (hasInteracted) return;
      const handleInteraction = () => {
        logger.info(
          "[ProducerLogic] Interacción de usuario detectada. Activando trackers."
        );
        setHasInteracted(true);
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
    },
  });

  const canInitializeTracking =
    producerConfig.TRACKING_ENABLED && consentStatus === "accepted";
  const shouldInitialize = canInitializeTracking && hasInteracted;

  useUtmTracker(shouldInitialize);
  useYandexMetrika(shouldInitialize);
  useGoogleAnalytics(shouldInitialize);
  useTrufflePixel(shouldInitialize);
  useWebvorkGuid(shouldInitialize);
  useNos3Tracker(shouldInitialize);

  if (error) {
    return (
      <DeveloperErrorDisplay context="ProducerLogic" errorMessage={error} />
    );
  }
  return null;
}

/**
 * @deprecated La lógica ha sido movida a `ProducerLogicWrapper` para cumplir con las Reglas de los Hooks.
 */
export function useProducerLogic() {
  // Esta función ahora está obsoleta y no hace nada.
}
