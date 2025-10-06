// RUTA: src/shared/hooks/aether/use-playback-control.ts
/**
 * @file use-playback-control.ts
 * @description Hook atómico para gestionar el estado de reproducción y volumen.
 * @version 3.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
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
  audioSrc?: string;
}

export function usePlaybackControl({
  videoTexture,
  audioRef,
  audioSrc,
}: UsePlaybackControlProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      logger.info(
        `[PlaybackControl] Toggle play. Nuevo estado: ${!prev ? "Playing" : "Paused"}`
      );
      return !prev;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      logger.info(
        `[PlaybackControl] Toggle mute. Nuevo estado: ${!prev ? "Unmuted" : "Muted"}`
      );
      return !prev;
    });
  }, []);

  useEffect(() => {
    const videoElement = videoTexture.image as HTMLVideoElement;
    const audioObject = audioRef.current;

    if (isPlaying) {
      videoElement
        .play()
        .catch((e) =>
          logger.warn("[PlaybackControl] Autoplay de vídeo bloqueado.", { e })
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
    videoElement.muted = true;
  }, [isPlaying, isMuted, videoTexture, audioRef, audioSrc]);

  return { isPlaying, isMuted, togglePlay, toggleMute };
}
