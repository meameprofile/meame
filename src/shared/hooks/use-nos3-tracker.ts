// RUTA: src/shared/hooks/use-nos3-tracker.ts
/**
 * @file use-nos3-tracker.ts
 * @description Hook soberano y orquestador para el colector de `nos3`.
 * @version 8.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import * as rrweb from "rrweb";
import { createId } from "@paralleldrive/cuid2";
import { logger } from "@/shared/lib/logging";
import type { eventWithTime } from "@/shared/lib/types/rrweb.types";

const SESSION_STORAGE_KEY = "nos3_session_id";
const BATCH_INTERVAL_MS = 15000;

export function useNos3Tracker(enabled: boolean): void {
  const traceId = useMemo(() => logger.startTrace("useNos3Tracker_v8.0"), []);
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
          `[nos3] Nueva sesión iniciada: ${sessionId}`
        );
      }
      return sessionId;
    } catch (error) {
      logger.warn("[nos3] sessionStorage no disponible. Usando ID efímero.", {
        error,
        traceId,
      });
      return createId();
    }
  }, [traceId]);

  const flushEvents = useCallback(
    async (isUnloading = false) => {
      if (eventsBuffer.current.length === 0) return;

      const flushTraceId = logger.startTrace("nos3.flushEvents");
      const eventsToSend = [...eventsBuffer.current];
      eventsBuffer.current = [];
      const sessionId = getOrCreateSessionId();
      logger.traceEvent(
        flushTraceId,
        `[nos3] Vaciando ${eventsToSend.length} eventos para ${sessionId}.`
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
          logger.traceEvent(flushTraceId, "Lote enviado vía sendBeacon.");
        } else {
          await fetch("/api/nos3/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          });
          logger.traceEvent(flushTraceId, "Lote enviado vía fetch.");
        }
        logger.success("[nos3] Lote de eventos enviado con éxito.", {
          traceId: flushTraceId,
        });
      } catch (error) {
        logger.error("[nos3] Fallo al enviar lote. Re-encolando eventos.", {
          error,
          traceId: flushTraceId,
        });
        eventsBuffer.current = [...eventsToSend, ...eventsBuffer.current];
      } finally {
        logger.endTrace(flushTraceId);
      }
    },
    [pathname, getOrCreateSessionId]
  );

  useEffect(() => {
    logger.info(
      `[useNos3Tracker] Hook montado. Estado: ${enabled ? "HABILITADO" : "DESHABILITADO"}.`,
      { traceId }
    );

    if (!enabled || isRecording.current) {
      if (!enabled)
        logger.traceEvent(traceId, "Grabación deshabilitada, no se iniciará.");
      return;
    }

    logger.success("[nos3] Condiciones cumplidas. Iniciando grabación.", {
      traceId,
    });
    isRecording.current = true;

    const intervalId = setInterval(() => flushEvents(false), BATCH_INTERVAL_MS);
    const stopRecording = rrweb.record({
      emit(event) {
        eventsBuffer.current.push(event as eventWithTime);
      },
      maskAllInputs: true,
      blockClass: "nos3-block",
      maskTextClass: "nos3-mask",
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushEvents(true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      logger.info("[nos3] Desmontando y deteniendo grabación.", { traceId });
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (stopRecording) stopRecording();
      flushEvents(true);
      isRecording.current = false;
      logger.endTrace(traceId);
    };
  }, [enabled, flushEvents, traceId]);
}
