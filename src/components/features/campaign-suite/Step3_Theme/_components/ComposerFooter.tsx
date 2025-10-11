// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/ComposerFooter.tsx
/**
 * @file ComposerFooter.tsx
 * @description Aparato de presentación puro y atómico para el pie de página del Compositor.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef, useMemo, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

interface ComposerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  saveButtonText: string;
  cancelButtonText: string;
}

export const ComposerFooter = forwardRef<HTMLDivElement, ComposerFooterProps>(
  (
    {
      className,
      onSave,
      onCancel,
      isSaving,
      saveButtonText,
      cancelButtonText,
      ...props
    },
    ref
  ) => {
    const traceId = useMemo(() => logger.startTrace("ComposerFooter_v1.0"), []);
    useEffect(() => {
      logger.info("[ComposerFooter] Componente montado.", { traceId });
      return () => logger.endTrace(traceId);
    }, [traceId]);

    return (
      <DialogFooter
        ref={ref}
        className={cn("p-4 border-t mt-auto", className)}
        {...props}
      >
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          {cancelButtonText}
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving && (
            <DynamicIcon
              name="LoaderCircle"
              className="mr-2 h-4 w-4 animate-spin"
            />
          )}
          {saveButtonText}
        </Button>
      </DialogFooter>
    );
  }
);
ComposerFooter.displayName = "ComposerFooter";
