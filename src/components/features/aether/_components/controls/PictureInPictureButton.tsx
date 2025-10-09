// RUTA: src/components/features/aether/_components/controls/PictureInPictureButton.tsx
/**
 * @file PictureInPictureButton.tsx
 * @description Componente atómico para el control de PiP, con contrato i18n alineado.
 * @version 2.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface PictureInPictureButtonProps {
  isPipActive: boolean;
  onTogglePip: () => void;
  enterPipLabel: string;
  exitPipLabel: string;
}

export function PictureInPictureButton({
  isPipActive,
  onTogglePip,
  enterPipLabel,
  exitPipLabel,
}: PictureInPictureButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onTogglePip}
      aria-label={isPipActive ? exitPipLabel : enterPipLabel}
    >
      <DynamicIcon
        name={isPipActive ? "PictureInPicture" : "PictureInPicture2"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
