// RUTA: src/shared/hooks/use-nos3-tracker.ts
/**
 * @file use-nos3-tracker.ts
 * @description Hook soberano y orquestador para el colector de `nos3`, ahora con
 *              integridad de importación restaurada y alineado con la ACS.
 * @version 7.0.0 (Sovereign Path Restoration)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import * as rrweb from "rrweb";
import { createId } from "@paralleldrive/cuid2";
import { logger } from "@/shared/lib/logging";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se corrige la ruta de importación para apuntar a la SSoT canónica de tipos.
import type { eventWithTime } from "@/shared/lib/types/rrweb.types";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

const SESSION_STORAGE_KEY = "nos3_session_id";
const BATCH_INTERVAL_MS = 15000;
const MAX_EVENTS_PER_BATCH = 100;

export function useNos3Tracker(enabled: boolean): void {
  const traceId = useMemo(
    () => logger.startTrace("useNos3Tracker_Lifecycle_v7.0"),
    []
  );
  const isRecording = useRef(false);
  const eventsBuffer = useRef<eventWithTime[]>([]);
  const pathname = usePathname();

  const getOrCreateSessionId = useCallback((): string => {
    try {
      let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionId) {
        sessionId = createId();
        sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        logger.traceEvent(
          traceId,
          `[nos3-colector] Nueva sesión iniciada: ${sessionId}`
        );
      }
      return sessionId;
    } catch (error) {
      logger.warn(
        "[nos3-colector] sessionStorage no disponible. Usando ID efímero.",
        { error, traceId }
      );
      return createId();
    }
  }, [traceId]);

  const flushEvents = useCallback(
    async (isUnloading = false) => {
      if (eventsBuffer.current.length === 0) return;

      const eventsToSend = [...eventsBuffer.current];
      eventsBuffer.current = [];
      const sessionId = getOrCreateSessionId();
      logger.traceEvent(
        traceId,
        `[nos3-colector] Vaciando ${eventsToSend.length} eventos para la sesión ${sessionId}.`
      );

      const payload = {
        sessionId,
        events: eventsToSend,
        metadata: { pathname, timestamp: Date.now() },
      };

      try {
        const body = JSON.stringify(payload);
        if (isUnloading && navigator.sendBeacon) {
          navigator.sendBeacon("/api/nos3/ingest", body);
          logger.traceEvent(traceId, "Lote de eventos enviado vía sendBeacon.");
        } else {
          await fetch("/api/nos3/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          });
          logger.traceEvent(traceId, "Lote de eventos enviado vía fetch.");
        }
      } catch (error) {
        logger.error(
          "[nos3-colector] Fallo al enviar lote. Re-encolando eventos.",
          {
            error,
            traceId,
          }
        );
        eventsBuffer.current = [...eventsToSend, ...eventsBuffer.current];
      }
    },
    [pathname, getOrCreateSessionId, traceId]
  );

  useEffect(() => {
    logger.info(
      `[useNos3Tracker] Hook montado. Estado de grabación: ${enabled}`,
      {
        traceId,
      }
    );

    if (!enabled || isRecording.current) {
      if (!enabled)
        logger.traceEvent(traceId, "Grabación deshabilitada, no se iniciará.");
      return;
    }

    logger.success(
      "[nos3-colector] Condiciones cumplidas. Iniciando grabación.",
      {
        traceId,
      }
    );
    isRecording.current = true;

    const intervalId = setInterval(flushEvents, BATCH_INTERVAL_MS);

    const stopRecording = rrweb.record({
      emit(event: eventWithTime) {
        eventsBuffer.current.push(event);
        if (eventsBuffer.current.length >= MAX_EVENTS_PER_BATCH) {
          logger.traceEvent(traceId, "Lote de eventos lleno. Vaciando...");
          flushEvents();
        }
      },
      maskAllInputs: true,
      blockClass: "nos3-block",
      maskTextClass: "nos3-mask",
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logger.traceEvent(traceId, "Pestaña oculta. Vaciando eventos...");
        flushEvents(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      logger.info("[nos3-colector] Desmontando y deteniendo grabación.", {
        traceId,
      });
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (stopRecording) stopRecording();
      flushEvents(true);
      isRecording.current = false;
      logger.endTrace(traceId);
    };
  }, [enabled, flushEvents, traceId]);
}
