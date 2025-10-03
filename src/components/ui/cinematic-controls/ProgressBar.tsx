// components/ui/cinematic-controls/ProgressBar.tsx
/**
 * @file ProgressBar.tsx
 * @description Componente atómico e interactivo para la barra de progreso del vídeo.
 *              v2.0.0 (A11y Elite Leveling): Refactorizado para ser completamente
 *              accesible (WAI-ARIA), soportando navegación y control por teclado.
 *              Resuelve las violaciones de linting `jsx-a11y`.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { logger } from "@/shared/lib/logging";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const seekTime = (clickX / rect.width) * duration;
    logger.trace(
      `[ProgressBar] Evento de seek (mouse) detectado. Nuevo tiempo: ${seekTime.toFixed(
        2
      )}s`
    );
    onSeek(seekTime);
  };

  // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: ACCESIBILIDAD] ---
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    const seekIncrement = 5; // Busca 5 segundos hacia adelante/atrás
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const newTime = Math.min(duration, currentTime + seekIncrement);
      onSeek(newTime);
      logger.trace(`[ProgressBar] Evento de seek (teclado ->) detectado.`);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const newTime = Math.max(0, currentTime - seekIncrement);
      onSeek(newTime);
      logger.trace(`[ProgressBar] Evento de seek (teclado <-) detectado.`);
    }
  };
  // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

  return (
    <div className="flex items-center gap-2 w-full text-white text-xs">
      <span>{formatTime(currentTime)}</span>
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: ACCESIBILIDAD] ---
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Barra de progreso del video"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
        // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---
        className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div
          className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
      <span>{formatTime(duration)}</span>
    </div>
  );
}
// components/ui/cinematic-controls/ProgressBar.tsx
