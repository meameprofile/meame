// RUTA: src/shared/hooks/aether/use-aether-orchestrator.ts
/**
 * @file use-aether-orchestrator.ts
 * @description Hook "Cerebro" soberano para la lógica de "Aether", nivelado a
 *              una arquitectura con una única fuente de verdad para el vídeo.
 * @version 14.0.0 (Single Source of Truth Architecture)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { usePlaybackControl } from "./use-playback-control";
import { useProgressTracker } from "./use-progress-tracker";
import { useFullscreenManager } from "./use-fullscreen-manager";
import { useAetherTelemetry } from "./use-aether-telemetry";
import { usePipWithDetachFallback } from "./use-pip-with-detach-fallback";
import { logger } from "@/shared/lib/logging";
import type { AetherOrchestratorProps } from "./aether.contracts";

export function useAetherOrchestrator({
  audioSrc,
  containerRef,
  onPlaybackEvent,
}: AetherOrchestratorProps) {
  const traceId = useMemo(
    () => logger.startTrace("useAetherOrchestrator_v14.0"),
    []
  );
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const audioRef = useRef<PositionalAudioImpl | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Los hooks ahora consumen el `videoEl` del estado, que es la SSoT.
  const { isPlaying, isMuted, togglePlay, toggleMute } = usePlaybackControl({
    videoEl,
    audioRef,
    audioSrc,
  });
  const progress = useProgressTracker(videoEl);
  const { isFullscreen, toggleFullscreen } = useFullscreenManager(containerRef);
  const { isPipActive, togglePip } = usePipWithDetachFallback(videoEl);
  const { dispatchEvent } = useAetherTelemetry(
    { current: videoEl },
    onPlaybackEvent
  );

  useEffect(() => {
    const groupId = logger.startGroup(`[Aether Hook] Montado.`);
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const onSeek = useCallback(
    (time: number) => {
      if (videoEl) {
        videoEl.currentTime = time;
        dispatchEvent("seek");
      }
      const audio = audioRef.current;
      if (audio && audio.isPlaying) {
        audio.stop();
        audio.offset = time;
        audio.play();
      }
    },
    [videoEl, audioRef, dispatchEvent]
  );

  const toggleExpand = useCallback(() => {
    logger.traceEvent(traceId, "Acción de Usuario: Toggle Expand");
    setIsExpanded((prev) => !prev);
  }, [traceId]);

  return {
    setVideoEl,
    setAudioRef: (audio: PositionalAudioImpl | null) => {
      audioRef.current = audio;
    },
    isPlaying,
    isMuted,
    isFullscreen,
    isExpanded,
    isDetached: isPipActive,
    progress,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    toggleExpand,
    toggleDetach: togglePip,
    onSeek,
  };
}
