// RUTA: src/shared/hooks/analytics/use-aura-tracker.ts
/**
 * @file use-aura-tracker.ts
 * @description Hook de cliente soberano para el sistema de analíticas "Aura".
 *              v7.0.0 (Resilient & Standardized): Simplificado para consumir la
 *              lógica de persistencia resiliente del logger soberano.
 * @version 7.0.0
 *@author L.I.A. Legacy
 */
"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { logger } from "@/shared/lib/logging";

// Los KEYS y la lógica de cryptoEngine han sido eliminados.
// El hook ya no tiene la responsabilidad de la persistencia.

type AuraScope = "user" | "visitor";

interface AuraTrackerProps {
  scope: AuraScope;
  campaignId?: string;
  variantId?: string;
  enabled: boolean;
}

export function useAuraTracker({
  scope,
  campaignId,
  variantId,
  enabled,
}: AuraTrackerProps) {
  const traceId = useMemo(
    () => logger.startTrace(`auraTracker_v7.0:${scope}`),
    [scope]
  );
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (enabled && scope === "visitor" && !fingerprintId) {
      const getFingerprint = async () => {
        try {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          setFingerprintId(result.visitorId);
          logger.traceEvent(
            traceId,
            `Fingerprint de visitante obtenido: ${result.visitorId}`
          );
        } catch (error) {
          logger.error("[AuraTracker] Fallo al obtener el fingerprint.", {
            error,
            traceId,
          });
        }
      };
      getFingerprint();
    }
  }, [scope, fingerprintId, enabled, traceId]);

  // La lógica de `sendBatch` ha sido eliminada y centralizada en `logging.ts`.

  const trackEvent = useCallback(
    async (eventType: string, payload: Record<string, unknown> = {}) => {
      if (!enabled) return;

      const eventPayload = {
        ...payload,
        pathname,
        campaignId: campaignId || "n/a",
        variantId: variantId || "n/a",
        sessionId: fingerprintId || "user_session",
        scope: scope,
      };

      // Se delega la creación del evento, encolado y envío al logger soberano.
      // Creamos una traza atómica para este evento específico.
      const eventTraceId = logger.startTrace(`auraEvent:${eventType}`);
      logger.track(eventType, {
        status: "IN_PROGRESS",
        traceId: eventTraceId,
        payload: eventPayload,
      });
      // El logger manejará la persistencia de forma asíncrona.
      logger.endTrace(eventTraceId);
    },
    [enabled, scope, fingerprintId, campaignId, variantId, pathname]
  );

  useEffect(() => {
    if (!enabled) return;

    logger.info(`[AuraTracker] Tracker activado para scope: ${scope}.`, {
      traceId,
    });

    // Se elimina la lógica de intervalo y de 'beforeunload'.
    // El logger soberano ahora gestiona el ciclo de vida de la persistencia de forma global.

    return () => {
      logger.info(`[AuraTracker] Hook desmontado para scope: ${scope}.`, {
        traceId,
      });
      logger.endTrace(traceId);
    };
  }, [enabled, scope, traceId]);

  return { trackEvent, fingerprintId };
}
