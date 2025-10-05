// RUTA: src/shared/hooks/use-cinematic-renderer.ts
/**
 * @file use-cinematic-renderer.ts
 * @description Hook orquestador para el motor "Aether".
 * @version 6.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
 */
"use client";

import { useRef, useCallback, useMemo, useEffect } from "react";
import { useVideoTexture } from "@react-three/drei";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { usePlaybackControl } from "./aether/use-playback-control";
import { useProgressTracker } from "./aether/use-progress-tracker";
import { useFullscreenManager } from "./aether/use-fullscreen-manager";
import { useAetherTelemetry } from "./aether/use-aether-telemetry";
import { logger } from "@/shared/lib/logging";

export type PlaybackEventType = "play" | "pause" | "seek" | "ended" | "volumechange";
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

export function useCinematicRenderer({
  src,
  audioSrc,
  containerRef,
  onPlaybackEvent,
}: CinematicRendererProps) {
  const traceId = useMemo(() => logger.startTrace("useCinematicRenderer_v6.0"), []);
  useEffect(() => {
    logger.info("[Hook] Orquestador Aether montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const videoTexture = useVideoTexture(src);
  const audioRef = useRef<PositionalAudioImpl>(null);
  logger.traceEvent(traceId, "Recursos (videoTexture, audioRef) inicializados.");

  const { isPlaying, isMuted, togglePlay, toggleMute } = usePlaybackControl({
    videoTexture,
    audioRef,
    audioSrc,
  });
  const progress = useProgressTracker(videoTexture);
  const { isFullscreen, toggleFullscreen } = useFullscreenManager(containerRef);
  const { dispatchEvent } = useAetherTelemetry(videoTexture, onPlaybackEvent);
  logger.traceEvent(traceId, "Sub-hooks de control, progreso y telemetría inicializados.");

  const onSeek = useCallback(
    (time: number) => {
      const seekTraceId = logger.startTrace("Aether.onSeek");
      const video = videoTexture.image as HTMLVideoElement;
      video.currentTime = time;
      const audio = audioRef.current;
      if (audio && audio.isPlaying) {
        audio.stop();
        audio.offset = time;
        audio.play();
      }
      dispatchEvent("seek");
      logger.success(`[Aether] Seek completado a ${time.toFixed(2)}s.`, { traceId: seekTraceId });
      logger.endTrace(seekTraceId);
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
