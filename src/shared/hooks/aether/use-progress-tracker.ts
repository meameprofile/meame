// RUTA: src/shared/hooks/aether/use-progress-tracker.ts
/**
 * @file use-progress-tracker.ts
 * @description Hook atómico y puro para rastrear el progreso de un elemento de vídeo,
 *              forjado con observabilidad de ciclo de vida completo y una arquitectura
 *              desacoplada de élite.
 * @version 5.0.0 (Holistic Fusion & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useMemo } from "react";

import { logger } from "@/shared/lib/logging";

export interface ProgressState {
  currentTime: number;
  duration: number;
}

/**
 * @function useProgressTracker
 * @description Hook puro que se suscribe a los eventos de tiempo de un
 *              HTMLVideoElement para rastrear su progreso de reproducción.
 * @param {HTMLVideoElement | null} videoEl - El elemento de vídeo a rastrear.
 * @returns {ProgressState} El estado actual del progreso del vídeo.
 */
export function useProgressTracker(videoEl: HTMLVideoElement | null) {
  const traceId = useMemo(
    () => logger.startTrace("useProgressTracker_Lifecycle_v5.0"),
    []
  );

  const [progress, setProgress] = useState<ProgressState>({
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    if (!videoEl) {
      return;
    }

    const groupId = logger.startGroup(
      "[ProgressTracker Hook] Suscribiendo a eventos de tiempo...",
      traceId
    );

    const handleTimeUpdate = () => {
      setProgress((prev) => ({ ...prev, currentTime: videoEl.currentTime }));
    };

    const handleDurationChange = () => {
      const newDuration = videoEl.duration;
      if (!isNaN(newDuration)) {
        setProgress((prev) => ({ ...prev, duration: newDuration }));
        logger.traceEvent(traceId, "Evento de DOM: durationchange", {
          newDuration,
        });
      }
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    videoEl.addEventListener("durationchange", handleDurationChange);
    if (videoEl.duration) {
      handleDurationChange();
    }

    logger.success("[ProgressTracker Hook] Suscrito y operacional.", {
      traceId,
    });

    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      videoEl.removeEventListener("durationchange", handleDurationChange);
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [videoEl, traceId]);

  return progress;
}
