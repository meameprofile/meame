// RUTA: src/shared/hooks/use-sound.ts
/**
 * @file use-sound.ts
 * @description Hook de utilidad para la reproducción de efectos de sonido.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useCallback } from "react";
import { logger } from "@/shared/lib/logging";

export const useSound = (soundPath: string, volume = 0.5) => {
  const play = useCallback(() => {
    const traceId = logger.startTrace(`useSound.play:${soundPath}`);
    try {
      if (typeof window.Audio === "undefined") {
        logger.warn(
          "[Sound] El API de Audio no está disponible en este entorno.",
          { traceId }
        );
        return;
      }
      const audio = new Audio(soundPath);
      audio.volume = volume;
      audio.play().catch((error) => {
        logger.error("[Sound] Fallo al reproducir el sonido.", {
          error,
          soundPath,
          traceId,
        });
      });
      logger.trace(`[Sound] Reproduciendo sonido: ${soundPath}`, { traceId });
    } catch (error) {
      logger.error("[Sound] Error inesperado al intentar reproducir sonido.", {
        error,
        traceId,
      });
    } finally {
      logger.endTrace(traceId);
    }
  }, [soundPath, volume]);
  return play;
};
