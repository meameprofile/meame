// RUTA: src/components/features/dev-tools/SuiteStyleComposer/_components/ComposerFooter.tsx
/**
 * @file ComposerFooter.tsx
 * @description Aparato de presentación puro para el pie de página del Compositor.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import React from "react";

import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { logger } from "@/shared/lib/logging";
interface ComposerFooterProps {
  onSave: () => void;
  onCancel: () => void;
  saveButtonText: string;
  cancelButtonText: string;
}
export function ComposerFooter({
  onSave,
  onCancel,
  saveButtonText,
  cancelButtonText,
}: ComposerFooterProps): React.ReactElement {
  logger.trace("[ComposerFooter] Renderizando.");
  return (
    <DialogFooter className="p-4 border-t mt-auto">
      <Button variant="outline" onClick={onCancel}>
        {cancelButtonText}
      </Button>
      <Button onClick={onSave}>{saveButtonText}</Button>
    </DialogFooter>
  );
}
