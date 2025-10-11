// RUTA: src/components/features/aether/_components/VideoPlane.tsx
/**
 * @file VideoPlane.tsx
 * @description Componente de escena 3D atómico y puro. Su única misión soberana
 *              es renderizar un plano con una textura de vídeo, ajustando su
 *              escala para llenar el viewport sin distorsión.
 * @version 5.0.0 (Atomic Purity & Architectural Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useThree, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import type * as THREE from "three";

import { logger } from "@/shared/lib/logging";

interface VideoPlaneProps {
  texture: THREE.VideoTexture;
}

export function VideoPlane({
  texture,
}: VideoPlaneProps): React.ReactElement | null {
  const traceId = useMemo(() => logger.startTrace("VideoPlane_v5.0"), []);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { size } = useThree();

  const video = texture.image as HTMLVideoElement;

  const planeScale = useMemo(() => {
    if (!video || video.videoHeight === 0) return [0, 0, 0] as const;

    const videoAspect = video.videoWidth / video.videoHeight;
    const viewportAspect = size.width / size.height;
    let scaleX, scaleY;

    if (viewportAspect > videoAspect) {
      scaleX = viewportAspect;
      scaleY = viewportAspect / videoAspect;
    } else {
      scaleX = videoAspect;
      scaleY = 1;
    }
    return [scaleX, scaleY, 1] as const;
  }, [video, size]);

  useFrame(() => {
    if (materialRef.current && materialRef.current.opacity < 1) {
      materialRef.current.opacity = Math.min(
        1,
        materialRef.current.opacity + 0.05
      );
    }
  });

  useEffect(() => {
    logger.info("[VideoPlane] Componente de plano visual montado.", {
      traceId,
    });
    if (materialRef.current) materialRef.current.opacity = 0;
    return () => logger.endTrace(traceId);
  }, [texture, traceId]);

  if (!video || video.videoHeight === 0) return null;

  return (
    <mesh scale={planeScale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        toneMapped={false}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
