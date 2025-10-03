// RUTA: src/shared/hooks/use-cinematic-renderer.ts
/**
 * @file use-cinematic-renderer.ts
 * @description Hook orquestador para el motor "Aether". Compone hooks atómicos.
 *              v5.0.0 (Holistic API & Logic Restoration): Restaura la integridad
 *              de la API, centraliza la propiedad de los tipos y corrige el flujo de datos.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useRef, useCallback } from "react";
import { useVideoTexture } from "@react-three/drei";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { usePlaybackControl } from "./aether/use-playback-control";
import { useProgressTracker } from "./aether/use-progress-tracker";
import { useFullscreenManager } from "./aether/use-fullscreen-manager";
import { useAetherTelemetry } from "./aether/use-aether-telemetry";

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: SSoT DE TIPOS] ---
// Se define y exporta el tipo aquí, en el orquestador.
export type PlaybackEventType =
  | "play"
  | "pause"
  | "seek"
  | "ended"
  | "volumechange";
export interface PlaybackEvent {
  type: PlaybackEventType;
  timestamp: number;
  duration: number;
  visitorId: string;
}

export interface CinematicRendererProps {
  src: string;
  audioSrc?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPlaybackEvent?: (event: PlaybackEvent) => void;
}
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export function useCinematicRenderer({
  src,
  audioSrc,
  containerRef,
  onPlaybackEvent,
}: CinematicRendererProps) {
  const videoTexture = useVideoTexture(src);
  const audioRef = useRef<PositionalAudioImpl>(null);

  const { isPlaying, isMuted, togglePlay, toggleMute } = usePlaybackControl({
    videoTexture,
    audioRef,
    audioSrc, // <-- Prop ahora pasada correctamente
  });
  const progress = useProgressTracker(videoTexture);
  const { isFullscreen, toggleFullscreen } = useFullscreenManager(containerRef);
  const { dispatchEvent } = useAetherTelemetry(videoTexture, onPlaybackEvent);

  const onSeek = useCallback(
    (time: number) => {
      const video = videoTexture.image as HTMLVideoElement;
      video.currentTime = time;
      const audio = audioRef.current;
      if (audio && audio.isPlaying) {
        audio.stop();
        audio.offset = time;
        audio.play();
      }
      dispatchEvent("seek");
    },
    [videoTexture, audioRef, dispatchEvent]
  );

  return {
    videoTexture,
    audioRef,
    isPlaying,
    isMuted,
    isFullscreen,
    progress,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    onSeek,
  };
}

export type CinematicRendererHook = ReturnType<typeof useCinematicRenderer>;
