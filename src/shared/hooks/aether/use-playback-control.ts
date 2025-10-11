// RUTA: src/shared/hooks/aether/use-playback-control.ts
/**
 * @file use-playback-control.ts
 * @description Hook atómico para gestionar el estado de reproducción y volumen.
 *              v5.0.0 (Holistic Observability & Decoupled Contract): Refactorizado
 *              para recibir el elemento de video directamente, mejorando el
 *              desacoplamiento y cumpliendo con el Pilar I (Hiper-Atomización).
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { PositionalAudio as PositionalAudioImpl } from "three";

import { logger } from "@/shared/lib/logging";

interface UsePlaybackControlProps {
  videoEl: HTMLVideoElement | null;
  audioRef: React.RefObject<PositionalAudioImpl | null>; // El audio puede no estar siempre
  audioSrc?: string;
}

export function usePlaybackControl({
  videoEl,
  audioRef,
  audioSrc,
}: UsePlaybackControlProps) {
  const traceId = useMemo(
    () => logger.startTrace("usePlaybackControl_Lifecycle_v5.0"),
    []
  );
  useEffect(() => {
    logger.info("[PlaybackControl Hook] Montado y listo.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

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
    const audioObject = audioRef.current;

    if (videoEl) {
      if (isPlaying) {
        videoEl
          .play()
          .catch((error) =>
            logger.warn(
              "[PlaybackControl] El autoplay del vídeo fue bloqueado por el navegador.",
              { error, traceId }
            )
          );
      } else {
        videoEl.pause();
      }
      // El vídeo siempre está silenciado; el audio 3D lo maneja.
      videoEl.muted = true;
    }

    if (audioObject) {
      if (
        isPlaying &&
        audioSrc &&
        audioObject.source &&
        !audioObject.isPlaying
      ) {
        audioObject.play();
      } else if (!isPlaying && audioObject.isPlaying) {
        audioObject.pause();
      }
      audioObject.setVolume(isMuted ? 0 : 1);
    }
  }, [isPlaying, isMuted, videoEl, audioRef, audioSrc, traceId]);

  return { isPlaying, isMuted, togglePlay, toggleMute };
}
