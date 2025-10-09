// RUTA: src/shared/hooks/use-nos3-tracker.ts
/**
 * @file use-nos3-tracker.ts
 * @description Hook soberano y orquestador para el colector de `nos3`, forjado con
 *              un guardián de entorno, carga diferida de dependencias, resiliencia
 *              de élite y observabilidad hiper-granular.
 * @version 13.0.0 (Definitive Environment Guard & Build Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { logger } from "@/shared/lib/logging";
import type { eventWithTime } from "@/shared/lib/types/rrweb.types";

const SESSION_STORAGE_KEY = "nos3_session_id";
const BATCH_INTERVAL_MS = 15000;

export function useNos3Tracker(enabled: boolean): void {
  const traceId = useMemo(() => logger.startTrace("useNos3Tracker_v13.0"), []);
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
      const groupId = logger.startGroup(
        `[nos3] Vaciando ${eventsBuffer.current.length} eventos...`,
        flushTraceId
      );
      const eventsToSend = [...eventsBuffer.current];
      eventsBuffer.current = [];
      const sessionId = getOrCreateSessionId();
      const payload = {
        sessionId,
        events: eventsToSend,
        metadata: { pathname, timestamp: Date.now() },
      };
      const body = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      try {
        if (isUnloading && navigator.sendBeacon) {
          if (!navigator.sendBeacon("/api/nos3/ingest", body))
            throw new Error("navigator.sendBeacon devolvió 'false'.");
        } else {
          const response = await fetch("/api/nos3/ingest", {
            method: "POST",
            body,
            keepalive: true,
          });
          if (!response.ok)
            throw new Error(
              `El servidor respondió con estado ${response.status}`
            );
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
        logger.endGroup(groupId);
        logger.endTrace(flushTraceId);
      }
    },
    [pathname, getOrCreateSessionId]
  );

  useEffect(() => {
    // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v13.0.0] ---
    // Este Guardián de Entorno es la solución definitiva. Previene que CUALQUIER
    // código de este efecto se ejecute o sea analizado en el servidor.
    if (!enabled || isRecording.current || typeof window === "undefined") {
      logger.trace(
        "[nos3] Guardián de Entorno: Ejecución omitida (no habilitado, ya grabando, o no es un navegador).",
        { traceId }
      );
      return;
    }
    // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v13.0.0] ---

    const groupId = logger.startGroup(
      "[nos3] Orquestando inicialización de grabador...",
      traceId
    );
    let stopRecording: (() => void) | undefined;

    const initializeRecorder = async () => {
      const initTraceId = logger.startTrace("nos3.initializeRecorder");
      try {
        logger.traceEvent(
          initTraceId,
          "Condiciones cumplidas. Iniciando grabación en el cliente..."
        );

        logger.traceEvent(
          initTraceId,
          "Cargando dinámicamente la librería rrweb..."
        );
        const rrweb = await import("rrweb");
        logger.traceEvent(initTraceId, "Librería rrweb cargada en el cliente.");

        stopRecording = rrweb.record({
          emit(event) {
            eventsBuffer.current.push(event);
          },
        });

        if (stopRecording) {
          isRecording.current = true;
          logger.success("[nos3] Grabación iniciada con éxito.", {
            traceId: initTraceId,
          });
        } else {
          throw new Error("rrweb.record no devolvió una función de 'stop'.");
        }
      } catch (error) {
        logger.error(
          "[Guardián de Resiliencia][nos3] Fallo CRÍTICO al inicializar rrweb. La grabación está deshabilitada.",
          {
            error: error instanceof Error ? error.message : String(error),
            traceId: initTraceId,
          }
        );
        isRecording.current = false;
      } finally {
        logger.endTrace(initTraceId);
      }
    };

    initializeRecorder();
    logger.endGroup(groupId);

    const intervalId = setInterval(() => flushEvents(false), BATCH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushEvents(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      const cleanupGroupId = logger.startGroup(
        "[nos3] Desmontando y limpiando recursos...",
        traceId
      );
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (stopRecording) {
        stopRecording();
        logger.traceEvent(traceId, "Función de 'stop' de rrweb invocada.");
      }
      flushEvents(true);
      isRecording.current = false;
      logger.success("[nos3] Recursos limpiados con éxito.", { traceId });
      logger.endGroup(cleanupGroupId);
      logger.endTrace(traceId);
    };
  }, [enabled, flushEvents, traceId]);
}
