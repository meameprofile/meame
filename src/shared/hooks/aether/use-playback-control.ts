// RUTA: src/shared/hooks/aether/use-playback-control.ts
/**
 * @file use-playback-control.ts
 * @description Hook atómico para gestionar el estado de reproducción y volumen.
 *              v4.0.0 (Holistic Observability & Elite Compliance): Inyectado con una
 *              traza de ciclo de vida completa y eventos de telemetría granulares
 *              para cumplir con el Pilar III (Observabilidad Profunda).
 * @version 4.0.0
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { logger } from "@/shared/lib/logging";
import type {
  VideoTexture,
  PositionalAudio as PositionalAudioImpl,
} from "three";

interface UsePlaybackControlProps {
  videoTexture: VideoTexture;
  audioRef: React.RefObject<PositionalAudioImpl>;
  audioSrc?: string;
}

export function usePlaybackControl({
  videoTexture,
  audioRef,
  audioSrc,
}: UsePlaybackControlProps) {
  // --- [INICIO DE REFACTORIZACIÓN DE OBSERVABILIDAD v4.0.0] ---
  const traceId = useMemo(
    () => logger.startTrace("usePlaybackControl_Lifecycle_v4.0"),
    []
  );
  useEffect(() => {
    logger.info("[PlaybackControl Hook] Montado y listo.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);
  // --- [FIN DE REFACTORIZACIÓN DE OBSERVABILIDAD v4.0.0] ---

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => {
    setIsPlaying((previousState) => {
      const newState = !previousState;
      logger.traceEvent(traceId, `Acción de Usuario: togglePlay`, {
        newState: newState ? "Playing" : "Paused",
      });
      return newState;
    });
  }, [traceId]);

  const toggleMute = useCallback(() => {
    setIsMuted((previousState) => {
      const newState = !previousState;
      logger.traceEvent(traceId, `Acción de Usuario: toggleMute`, {
        newState: newState ? "Unmuted" : "Muted",
      });
      return newState;
    });
  }, [traceId]);

  useEffect(() => {
    const videoElement = videoTexture.image as HTMLVideoElement;
    const audioObject = audioRef.current;

    if (isPlaying) {
      videoElement
        .play()
        .catch((error) =>
          logger.warn("[PlaybackControl] El autoplay del vídeo fue bloqueado por el navegador.", { error, traceId })
        );
      if (audioSrc && audioObject?.source && !audioObject.isPlaying) {
        audioObject.play();
      }
    } else {
      videoElement.pause();
      if (audioObject?.isPlaying) {
        audioObject.pause();
      }
    }

    if (audioObject) {
      audioObject.setVolume(isMuted ? 0 : 1);
    }
    // El vídeo siempre está silenciado para que el control de audio sea manejado por el PositionalAudio 3D.
    videoElement.muted = true;
  }, [isPlaying, isMuted, videoTexture, audioRef, audioSrc, traceId]);

  return { isPlaying, isMuted, togglePlay, toggleMute };
}
