// RUTA: src/shared/hooks/analytics/use-aura-tracker.ts
/**
 * @file use-aura-tracker.ts
 * @description Hook de cliente soberano para el sistema de analíticas "Aura".
 *              v8.0.0 (Heimdall Task Alignment): Nivelado para utilizar el
 *              paradigma de Tareas del emisor Heimdall en lugar de la función
 *              'track' obsoleta, cumpliendo con la arquitectura de observabilidad soberana.
 * @version 8.0.0
 *@author L.I.A. Legacy
 */
"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useState, useMemo } from "react";

import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

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
    () => logger.startTrace(`auraTracker_v8.0:${scope}`),
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

      // --- [INICIO DE REFACTORIZACIÓN A TAREAS DE HEIMDALL] ---
      // Cada evento de Aura ahora se registra como una Tarea atómica en Heimdall.
      const taskId = logger.startTask(
        {
          domain: "AURA_EVENT",
          entity: scope.toUpperCase(),
          action: eventType.toUpperCase(),
        },
        `Aura Event: ${eventType}`,
        eventPayload
      );
      // La tarea se finaliza inmediatamente, ya que es un evento puntual.
      logger.endTask(taskId, "SUCCESS");
      // --- [FIN DE REFACTORIZACIÓN A TAREAS DE HEIMDALL] ---
    },
    [enabled, scope, fingerprintId, campaignId, variantId, pathname]
  );

  useEffect(() => {
    if (!enabled) return;

    logger.info(`[AuraTracker] Tracker activado para scope: ${scope}.`, {
      traceId,
    });

    return () => {
      logger.info(`[AuraTracker] Hook desmontado para scope: ${scope}.`, {
        traceId,
      });
      logger.endTrace(traceId);
    };
  }, [enabled, scope, traceId]);

  return { trackEvent, fingerprintId };
}
