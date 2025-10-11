// RUTA: src/components/features/aether/_components/controls/VolumeControl.tsx
/**
 * @file VolumeControl.tsx
 * @description Componente atómico para el control de volumen, con contrato i18n alineado.
 * @version 2.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface VolumeControlProps {
  isMuted: boolean;
  onToggleMute: () => void;
  muteLabel: string;
  unmuteLabel: string;
}

export function VolumeControl({
  isMuted,
  onToggleMute,
  muteLabel,
  unmuteLabel,
}: VolumeControlProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleMute}
      aria-label={isMuted ? unmuteLabel : muteLabel}
    >
      <DynamicIcon
        name={isMuted ? "VolumeX" : "Volume2"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
