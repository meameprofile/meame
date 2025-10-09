// RUTA: src/components/features/aether/_components/controls/ProgressBar.tsx
/**
 * @file ProgressBar.tsx
 * @description Componente atómico para la barra de progreso, con contrato i18n alineado.
 * @version 3.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
//import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  ariaLabel: string;
}

const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
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
  ariaLabel,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const seekTime = (clickX / rect.width) * duration;
    onSeek(seekTime);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    const seekIncrement = 5;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onSeek(Math.min(duration, currentTime + seekIncrement));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onSeek(Math.max(0, currentTime - seekIncrement));
    }
  };

  return (
    <div className="flex items-center gap-2 w-full text-white text-xs">
      <span>{formatTime(currentTime)}</span>
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
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
