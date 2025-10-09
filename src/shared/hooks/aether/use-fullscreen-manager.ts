// RUTA: src/shared/hooks/aether/use-fullscreen-manager.ts
/**
 * @file use-fullscreen-manager.ts
 * @description Hook atómico para gestionar el estado de pantalla completa.
 *              v3.0.0 (Holistic Observability): Inyectado con una traza de ciclo de
 *              vida para monitorear el montaje y la suscripción a eventos del DOM,
 *              cumpliendo con el Pilar III de Calidad.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/shared/lib/logging";

export function useFullscreenManager(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const traceId = useMemo(
    () => logger.startTrace("useFullscreenManager_Lifecycle_v3.0"),
    []
  );
  useEffect(() => {
    logger.info("[FullscreenManager Hook] Montado y listo.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const actionTraceId = logger.startTrace("toggleFullscreen_Action");
    const element = containerRef.current;
    if (!element) {
      logger.warn(
        "[FullscreenManager] Intento de toggle sin un elemento contenedor.",
        {
          traceId: actionTraceId,
        }
      );
      logger.endTrace(actionTraceId, { error: true });
      return;
    }

    if (!document.fullscreenElement) {
      logger.traceEvent(
        actionTraceId,
        "Solicitando entrada a pantalla completa..."
      );
      element.requestFullscreen().catch((error) => {
        logger.error("Error al intentar entrar en pantalla completa.", {
          error,
          traceId: actionTraceId,
        });
      });
    } else {
      logger.traceEvent(
        actionTraceId,
        "Solicitando salida de pantalla completa..."
      );
      document.exitFullscreen();
    }
    logger.endTrace(actionTraceId);
  }, [containerRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      logger.traceEvent(traceId, `Evento de DOM: fullscreenchange`, {
        isCurrentlyFullscreen,
      });
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [traceId]);

  return { isFullscreen, toggleFullscreen };
}
