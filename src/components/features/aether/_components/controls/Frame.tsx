// components/ui/cinematic-controls/Frame.tsx
/**
 * @file Frame.tsx
 * @description Componente de UI atómico y de élite para el marco del renderizador.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @status Active
 */
"use client";

import React from "react";

import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

/**
 * @interface FrameProps
 * @description Contrato de props para el componente Frame.
 */
interface FrameProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string; // Ejemplo: 'border-primary'
  borderWidth?: string; // Ejemplo: 'border-2'
}

/**
 * @component Frame
 * @description Renderiza un marco superpuesto y personalizable.
 */
export function Frame({
  children,
  className,
  borderColor = "border-primary/50",
  borderWidth = "border-2",
}: FrameProps): React.ReactElement {
  logger.trace("[Frame] Componente de marco renderizado.");

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-10", // No interfiere con los eventos del canvas
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-2 md:inset-4 rounded-md",
          "transition-colors duration-300",
          borderColor,
          borderWidth
        )}
      />
      {children}
    </div>
  );
}
// components/ui/cinematic-controls/Frame.tsx
