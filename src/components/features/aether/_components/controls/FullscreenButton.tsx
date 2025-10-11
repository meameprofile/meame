// RUTA: src/components/features/aether/_components/controls/FullscreenButton.tsx
/**
 * @file FullscreenButton.tsx
 * @description Componente atómico para el control de pantalla completa, con contrato i18n alineado.
 * @version 2.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  enterFullscreenLabel: string;
  exitFullscreenLabel: string;
}

export function FullscreenButton({
  isFullscreen,
  onToggleFullscreen,
  enterFullscreenLabel,
  exitFullscreenLabel,
}: FullscreenButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleFullscreen}
      aria-label={isFullscreen ? exitFullscreenLabel : enterFullscreenLabel}
    >
      <DynamicIcon
        name={isFullscreen ? "Shrink" : "Expand"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
