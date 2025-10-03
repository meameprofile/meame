// components/ui/cinematic-controls/PlayPauseButton.tsx
/**
 * @file PlayPauseButton.tsx
 * @description Componente atómico para el botón de Play/Pausa.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlayPauseButton({
  isPlaying,
  onTogglePlay,
}: PlayPauseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onTogglePlay}
      aria-label={isPlaying ? "Pausar" : "Reproducir"}
    >
      <DynamicIcon
        name={isPlaying ? "Pause" : "Play"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
// components/ui/cinematic-controls/PlayPauseButton.tsx
