// RUTA: src/components/media/VideoPlane.tsx
/**
 * @file VideoPlane.tsx
 * @description Componente de escena para mostrar una textura de vídeo y alojar
 *              el audio posicional 3D.
 * @version 2.0.0 (Conditional Audio)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { useThree } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import * as THREE from "three";

interface VideoPlaneProps {
  texture: THREE.VideoTexture;
  audioRef: React.RefObject<THREE.PositionalAudio>;
  audioSrc?: string;
}

export function VideoPlane({ texture, audioRef, audioSrc }: VideoPlaneProps) {
  const { size } = useThree();
  const videoAspect = texture.image.videoWidth / texture.image.videoHeight;
  const viewportAspect = size.width / size.height;

  const scaleX = videoAspect > viewportAspect ? viewportAspect : videoAspect;
  const scaleY =
    videoAspect > viewportAspect ? viewportAspect / videoAspect : 1;

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
      {/* --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: RENDERIZADO CONDICIONAL] --- */}
      {audioSrc && <PositionalAudio ref={audioRef} url={audioSrc} />}
      {/* --- [FIN DE REFACTORIZACIÓN DE ÉLITE] --- */}
    </mesh>
  );
}
