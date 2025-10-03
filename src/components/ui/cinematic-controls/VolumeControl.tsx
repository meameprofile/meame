// components/ui/cinematic-controls/VolumeControl.tsx
/**
 * @file VolumeControl.tsx
 * @description Componente atómico para el control de volumen (silenciar/activar).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
interface VolumeControlProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VolumeControl({ isMuted, onToggleMute }: VolumeControlProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleMute}
      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
    >
      <DynamicIcon
        name={isMuted ? "VolumeX" : "Volume2"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
// components/ui/cinematic-controls/VolumeControl.tsx
