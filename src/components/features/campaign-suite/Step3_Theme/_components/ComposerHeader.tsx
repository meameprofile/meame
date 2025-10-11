// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/ComposerHeader.tsx
/**
 * @file ComposerHeader.tsx
 * @description Aparato de presentación puro y atómico para el encabezado del Compositor.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef, useMemo, useEffect } from "react";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

interface ComposerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export const ComposerHeader = forwardRef<HTMLDivElement, ComposerHeaderProps>(
  ({ className, title, description, ...props }, ref) => {
    const traceId = useMemo(() => logger.startTrace("ComposerHeader_v1.0"), []);
    useEffect(() => {
      logger.info("[ComposerHeader] Componente montado.", { traceId });
      return () => logger.endTrace(traceId);
    }, [traceId]);

    return (
      <DialogHeader
        ref={ref}
        className={cn("p-6 border-b", className)}
        {...props}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
    );
  }
);
ComposerHeader.displayName = "ComposerHeader";
