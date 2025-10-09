// RUTA: src/components/features/aether/_components/controls/PlayPauseButton.tsx
/**
 * @file PlayPauseButton.tsx
 * @description Componente atómico para el botón de Play/Pausa, con contrato i18n alineado.
 * @version 2.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  playLabel: string;
  pauseLabel: string;
}

export function PlayPauseButton({
  isPlaying,
  onTogglePlay,
  playLabel,
  pauseLabel,
}: PlayPauseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onTogglePlay}
      aria-label={isPlaying ? pauseLabel : playLabel}
    >
      <DynamicIcon
        name={isPlaying ? "Pause" : "Play"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
