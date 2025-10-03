// RUTA: src/shared/hooks/aether/use-fullscreen-manager.ts
/**
 * @file use-fullscreen-manager.ts
 * @description Hook atómico para gestionar el estado de pantalla completa.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/shared/lib/logging";

export function useFullscreenManager(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        logger.error("Error al intentar entrar en pantalla completa", { err });
      });
    } else {
      document.exitFullscreen();
    }
  }, [containerRef]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return { isFullscreen, toggleFullscreen };
}
