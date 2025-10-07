// RUTA: src/shared/hooks/use-cinematic-renderer.ts
/**
 * @file use-cinematic-renderer.ts
 * @description Hook "Cerebro" y Orquestador Soberano para el motor cinematográfico "Aether".
 *              Este aparato ensambla y coordina todos los sub-sistemas (hooks atómicos)
 *              necesarios para renderizar una experiencia de vídeo interactiva en WebGL.
 * @version 7.0.0 (Holistic Observability & Elite Compliance)
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

export function useCinematicRenderer({
  src,
  audioSrc,
  containerRef,
  onPlaybackEvent,
}: CinematicRendererProps) {
  const traceId = useMemo(
    () => logger.startTrace("useCinematicRenderer_Orchestrator_v7.0"),
    []
  );

  // --- [INICIO DE REFACTORIZACIÓN DE OBSERVABILIDAD v7.0.0] ---
  useEffect(() => {
    const groupId = logger.startGroup(`[Aether Orchestrator] Montando y ensamblando sub-sistemas...`, traceId);
    logger.info("Hook orquestador de Aether inicializado.", { traceId });
    return () => {
        logger.endGroup(groupId);
        logger.endTrace(traceId);
    };
  }, [traceId]);
  // --- [FIN DE REFACTORIZACIÓN DE OBSERVABILIDAD v7.0.0] ---

  const videoTexture = useVideoTexture(src);
  const audioRef = useRef<PositionalAudioImpl>(null);
  logger.traceEvent(traceId, "Recursos base (videoTexture, audioRef) inicializados.");

  // Ensamblaje de sub-sistemas (hooks atómicos)
  const { isPlaying, isMuted, togglePlay, toggleMute } = usePlaybackControl({ videoTexture, audioRef, audioSrc });
  const progress = useProgressTracker(videoTexture);
  const { isFullscreen, toggleFullscreen } = useFullscreenManager(containerRef);
  const { dispatchEvent } = useAetherTelemetry(videoTexture, onPlaybackEvent);
  logger.traceEvent(traceId, "Sub-hooks de control, progreso, fullscreen y telemetría inicializados.");

  const onSeek = useCallback(
    (time: number) => {
      const seekTraceId = logger.startTrace("Aether.onSeek_Action");
      const videoElement = videoTexture.image as HTMLVideoElement;
      videoElement.currentTime = time;

      const audio = audioRef.current;
      if (audio && audio.isPlaying) {
        audio.stop();
        audio.offset = time;
        audio.play();
      }

      dispatchEvent("seek");
      logger.success(`[Aether] Operación de seek completada. Nuevo tiempo: ${time.toFixed(2)}s.`, { traceId: seekTraceId });
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
