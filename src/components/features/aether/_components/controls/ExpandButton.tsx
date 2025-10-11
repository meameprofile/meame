// RUTA: src/components/features/aether/_components/controls/ExpandButton.tsx
/**
 * @file ExpandButton.tsx
 * @description Componente atómico para el control de expansión, con contrato i18n alineado.
 * @version 2.0.0 (I18n & A11y Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface ExpandButtonProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  expandLabel: string;
  collapseLabel: string;
}

export function ExpandButton({
  isExpanded,
  onToggleExpand,
  expandLabel,
  collapseLabel,
}: ExpandButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleExpand}
      aria-label={isExpanded ? collapseLabel : expandLabel}
    >
      <DynamicIcon
        name={isExpanded ? "Minimize2" : "Maximize2"}
        className="h-5 w-5 text-white"
      />
    </Button>
  );
}
