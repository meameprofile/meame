// RUTA: src/components/media/CinematicRenderer.tsx
/**
 * @file CinematicRenderer.tsx
 * @description Fachada pública para "Aether", ahora con un contrato de API completo.
 * @version 2.1.0 (Holistic API Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import React, { useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useCinematicRenderer,
  type PlaybackEvent,
  type CinematicRendererHook,
  type CinematicRendererProps as HookProps,
} from "@/shared/hooks/use-cinematic-renderer";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import {
  Frame,
  BrandLogo,
  ControlsBar,
} from "@/components/ui/cinematic-controls";
import { VideoPlane } from "./VideoPlane";

interface CinematicRendererProps {
  src: string;
  audioSrc?: string;
  className?: string;
}

export function CinematicRenderer({
  src,
  audioSrc,
  className,
}: CinematicRendererProps): React.ReactElement {
  logger.info(
    "[CinematicRenderer] Componente renderizado (v2.1 - API Restored)."
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const handlePlaybackEvent = useCallback((event: PlaybackEvent) => {
    logger.info(`[Aether Telemetry] Evento de Reproducción`, { event });
  }, []);

  const hookState = useCinematicRenderer({
    src,
    audioSrc,
    containerRef,
    onPlaybackEvent: handlePlaybackEvent,
  } as HookProps);

  type ControlsBarProps = Pick<
    CinematicRendererHook,
    | "isPlaying"
    | "togglePlay"
    | "isMuted"
    | "toggleMute"
    | "isFullscreen"
    | "toggleFullscreen"
    | "progress"
    | "onSeek"
  >;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full aspect-video bg-black rounded-lg overflow-hidden group",
        className
      )}
    >
      <Canvas>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} />
        {hookState.videoTexture && (
          <VideoPlane
            texture={hookState.videoTexture}
            audioRef={hookState.audioRef}
            audioSrc={audioSrc}
          />
        )}
      </Canvas>
      <Frame>
        <BrandLogo />
        <ControlsBar {...(hookState as ControlsBarProps)} />
      </Frame>
    </div>
  );
}
