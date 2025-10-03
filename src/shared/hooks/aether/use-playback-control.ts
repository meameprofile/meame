// RUTA: src/shared/hooks/aether/use-playback-control.ts
/**
 * @file use-playback-control.ts
 * @description Hook atómico para gestionar el estado de reproducción y volumen.
 * @version 2.0.0 (Conditional Audio Logic)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import { logger } from "@/shared/lib/logging";
import type {
  VideoTexture,
  PositionalAudio as PositionalAudioImpl,
} from "three";

interface UsePlaybackControlProps {
  videoTexture: VideoTexture;
  audioRef: React.RefObject<PositionalAudioImpl>;
  audioSrc?: string; // <-- Prop añadida al contrato
}

export function usePlaybackControl({
  videoTexture,
  audioRef,
  audioSrc, // <-- Prop consumida
}: UsePlaybackControlProps) {
  logger.trace("[usePlaybackControl] Hook inicializado v2.0.");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  useEffect(() => {
    const videoElement = videoTexture.image as HTMLVideoElement;
    const audioObject = audioRef.current;

    if (isPlaying) {
      videoElement
        .play()
        .catch((e) => logger.warn("Autoplay de vídeo bloqueado.", { e }));
      // Solo intenta reproducir el audio si existe y tiene una fuente.
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
    videoElement.muted = true;
  }, [isPlaying, isMuted, videoTexture, audioRef, audioSrc]); // <-- audioSrc añadido a las dependencias

  return { isPlaying, isMuted, togglePlay, toggleMute };
}
