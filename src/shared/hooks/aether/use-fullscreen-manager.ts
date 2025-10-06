// RUTA: src/shared/hooks/aether/use-fullscreen-manager.ts
/**
 * @file use-fullscreen-manager.ts
 * @description Hook atómico para gestionar el estado de pantalla completa.
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/shared/lib/logging";

export function useFullscreenManager(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const traceId = logger.startTrace("toggleFullscreen");
    const elem = containerRef.current;
    if (!elem) {
      logger.warn("[FullscreenManager] Intento de toggle sin contenedor.", {
        traceId,
      });
      return;
    }

    if (!document.fullscreenElement) {
      logger.traceEvent(traceId, "Solicitando entrada a pantalla completa...");
      elem.requestFullscreen().catch((err) => {
        logger.error("Error al entrar en pantalla completa", { err, traceId });
      });
    } else {
      logger.traceEvent(traceId, "Solicitando salida de pantalla completa...");
      document.exitFullscreen();
    }
    logger.endTrace(traceId);
  }, [containerRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      logger.info(
        `[FullscreenManager] Estado cambiado a: ${isCurrentlyFullscreen ? "ACTIVADO" : "DESACTIVADO"}.`
      );
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return { isFullscreen, toggleFullscreen };
}
