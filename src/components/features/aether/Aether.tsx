// RUTA: src/components/features/aether/Aether.tsx
/**
 * @file Aether.tsx
 * @description Orquestador de UI soberano, con una arquitectura de renderizado
 *              desacoplada que respeta la frontera entre React-DOM y R3F.
 * @version 23.0.0 (Architectural Purity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { z } from "zod";
import { cn } from "@/shared/lib/utils/cn";
import { Frame, BrandLogo, ControlsBar } from "./_components/controls";
import { useAetherOrchestrator } from "@/shared/hooks/aether/use-aether-orchestrator";
import { useVideoState } from "@/shared/hooks/aether/use-video-state";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { AetherControlsContentSchema } from "@/shared/lib/schemas/aether/aether.schema";
import { CanvasCore } from "./_components/CanvasCore";
import { AetherOverlays } from "./_components/AetherOverlays";

type AetherControlsContent = z.infer<typeof AetherControlsContentSchema>;

interface AetherProps {
  src: string;
  audioSrc?: string;
  className?: string;
  content: AetherControlsContent;
}

export function Aether({
  src,
  audioSrc,
  className,
  content,
}: AetherProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Aether_Lifecycle_v23.0"),
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const hookState = useAetherOrchestrator({
    src,
    audioSrc,
    containerRef,
    onPlaybackEvent: (event) => logger.trace("[Aether Telemetry]", { event }),
  });
  const { videoState } = useVideoState(videoEl);

  useEffect(() => {
    logger.info("[Aether UI] Orquestador de UI montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  if (!content) {
    const errorMsg = "Violación de Contrato: La prop 'content' es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <div className={cn("aspect-video bg-black rounded-lg", className)}>
        <DeveloperErrorDisplay context="Aether.tsx" errorMessage={errorMsg} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "aspect-video bg-black rounded-lg overflow-hidden group transition-all duration-500 ease-in-out",
        hookState.isDetached
          ? "fixed bottom-4 right-4 w-1/4 z-50"
          : "relative w-full",
        !hookState.isDetached &&
          (hookState.isExpanded ? "scale-100" : "scale-[0.20]"),
        className
      )}
    >
      <AetherOverlays videoState={videoState} content={content} />

      <Canvas
        style={{
          display: videoState === "error" ? "none" : "block",
          background: "black",
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} />
        <Suspense fallback={null}>
          <CanvasCore
            src={src}
            audioSrc={audioSrc}
            onVideoReady={(video) => {
              setVideoEl(video);
              hookState.setVideoEl(video);
            }}
            onAudioReady={hookState.setAudioRef}
          />
        </Suspense>
      </Canvas>

      <Frame>
        <BrandLogo />
        <ControlsBar {...hookState} content={content} />
      </Frame>
    </div>
  );
}
