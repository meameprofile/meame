// RUTA: src/shared/hooks/producer-logic.tsx
/**
 * @file producer-logic.tsx
 * @description Orquestador de lógica de tracking, encapsulado en un componente
 *              wrapper para cumplir con las Reglas de los Hooks y la arquitectura de élite.
 * @version 10.0.0 (React Hooks Contract Compliance)
 * @author L.I.A. Legacy
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
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

export function ProducerLogicWrapper(): React.ReactElement | null {
  // --- [INICIO DE REFACTORIZACIÓN DE REGLAS DE HOOKS] ---
  // Todos los hooks se llaman incondicionalmente en el nivel superior.
  const [hasInteracted, setHasInteracted] = useState(false);
  const producerConfig = getProducerConfig();
  const { status: consentStatus } = useCookieConsent();

  const { error } = useExecutionGuard({
    name: "ProducerLogic Interaction Listener",
    dependencies: [hasInteracted],
    callback: () => {
      if (hasInteracted) return;
      const handleInteraction = () => {
        logger.info("[ProducerLogic] Interacción de usuario detectada. Activando trackers.");
        setHasInteracted(true);
        eventListeners.forEach((event) =>
          window.removeEventListener(event, handleInteraction)
        );
      };
      const eventListeners: (keyof WindowEventMap)[] = ["mousedown", "touchstart", "keydown", "scroll"];
      eventListeners.forEach((event) =>
        window.addEventListener(event, handleInteraction, { once: true, passive: true })
      );
      return () =>
        eventListeners.forEach((event) =>
          window.removeEventListener(event, handleInteraction)
        );
    },
  });

  // La lógica condicional ahora determina el valor de una bandera.
  const canInitializeTracking = producerConfig.TRACKING_ENABLED && consentStatus === "accepted";
  const shouldInitialize = canInitializeTracking && hasInteracted;

  // Los hooks de tracking se llaman incondicionalmente, pero se activan
  // internamente según el valor de 'shouldInitialize'.
  useUtmTracker(shouldInitialize);
  useYandexMetrika(shouldInitialize);
  useGoogleAnalytics(shouldInitialize);
  useTrufflePixel(shouldInitialize);
  useWebvorkGuid(shouldInitialize);
  useNos3Tracker(shouldInitialize);
  // --- [FIN DE REFACTORIZACIÓN DE REGLAS DE HOOKS] ---

  if (error) {
    return <DeveloperErrorDisplay context="ProducerLogic" errorMessage={error} />;
  }
  return null;
}

/**
 * @deprecated La lógica ha sido movida a `ProducerLogicWrapper` para cumplir con las Reglas de los Hooks.
 */
export function useProducerLogic() {
  // Esta función ahora está obsoleta y no hace nada.
}
