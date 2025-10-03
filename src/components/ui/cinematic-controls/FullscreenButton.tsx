// components/ui/cinematic-controls/FullscreenButton.tsx
/**
 * @file FullscreenButton.tsx
 * @description Componente atómico para el control de pantalla completa.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function FullscreenButton({
  isFullscreen,
  onToggleFullscreen,
}: FullscreenButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleFullscreen}
      aria-label={
        isFullscreen
          ? "Salir de pantalla completa"
          : "Entrar a pantalla completa"
      }
    >
      <DynamicIcon
        name={isFullscreen ? "Shrink" : "Expand"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
// components/ui/cinematic-controls/FullscreenButton.tsx
