// RUTA: src/components/features/aether/_components/CanvasCore.tsx
/**
 * @file CanvasCore.tsx
 * @description Núcleo de renderizado y "Maestro de Escena" para "Aether".
 *              Ensambla todos los objetos 3D y pasa sus referencias al
 *              orquestador padre a través de callbacks.
 * @version 2.0.0 (Scene Master & Architectural Purity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef, useEffect } from "react";
import { useVideoTexture, PositionalAudio } from "@react-three/drei";
import { VideoPlane } from "./VideoPlane";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { logger } from "@/shared/lib/logging";

interface CanvasCoreProps {
  src: string;
  audioSrc?: string;
  onVideoReady: (video: HTMLVideoElement) => void;
  onAudioReady: (audio: PositionalAudioImpl) => void;
}

export function CanvasCore({
  src,
  audioSrc,
  onVideoReady,
  onAudioReady,
}: CanvasCoreProps) {
  const audioRef = useRef<PositionalAudioImpl>(null!);

  const texture = useVideoTexture(src, {
    unsuspend: "canplay",
    crossOrigin: "Anonymous",
    loop: true,
    muted: true,
  });

  useEffect(() => {
    const videoElement = texture.image as HTMLVideoElement;
    if (videoElement) {
      onVideoReady(videoElement);
      logger.trace("[CanvasCore] Callback onVideoReady invocado.");
    }
  }, [texture.image, onVideoReady]);

  useEffect(() => {
    if (audioRef.current) {
      onAudioReady(audioRef.current);
      logger.trace("[CanvasCore] Callback onAudioReady invocado.");
    }
  }, [onAudioReady]);

  return (
    <>
      <VideoPlane texture={texture} />
      {audioSrc && <PositionalAudio ref={audioRef} url={audioSrc} />}
    </>
  );
}
