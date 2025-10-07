// RUTA: src/shared/hooks/aether/use-progress-tracker.ts
/**
 * @file use-progress-tracker.ts
 * @description Hook atómico para rastrear el progreso de reproducción del vídeo.
 *              v3.0.0 (Holistic Observability): Inyectado con una traza de ciclo de
 *              vida para monitorear la suscripción a eventos del elemento de vídeo
 *              y la actualización del estado de progreso.
 * @version 3.0.0
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import type { VideoTexture } from "three";
import { logger } from "@/shared/lib/logging";

export interface ProgressState {
  currentTime: number;
  duration: number;
}

export function useProgressTracker(videoTexture: VideoTexture) {
  // --- [INICIO DE REFACTORIZACIÓN DE OBSERVABILIDAD v3.0.0] ---
  const traceId = useMemo(
    () => logger.startTrace("useProgressTracker_Lifecycle_v3.0"),
    []
  );
  // --- [FIN DE REFACTORIZACIÓN DE OBSERVABILIDAD v3.0.0] ---

  const [progress, setProgress] = useState<ProgressState>({
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    logger.info("[ProgressTracker Hook] Montado, suscribiendo a eventos de tiempo.", { traceId });
    const videoElement = videoTexture.image as HTMLVideoElement;

    const handleTimeUpdate = () => {
      setProgress((previousProgress) => ({ ...previousProgress, currentTime: videoElement.currentTime }));
    };

    const handleDurationChange = () => {
      const newDuration = videoElement.duration;
      if (!isNaN(newDuration)) {
        setProgress((previousProgress) => ({ ...previousProgress, duration: newDuration }));
        logger.traceEvent(traceId, "Evento de DOM: durationchange", { newDuration });
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    // Dispara una vez al inicio en caso de que la duración ya esté disponible
    if (videoElement.duration) {
      handleDurationChange();
    }

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      logger.endTrace(traceId);
    };
  }, [videoTexture, traceId]);

  return progress;
}
