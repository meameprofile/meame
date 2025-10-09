// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/DeletePresetDialog.tsx
/**
 * @file DeletePresetDialog.tsx
 * @description Aparato de UI atómico para el diálogo de confirmación de eliminación de presets.
 * @version 2.1.0 (Type-Safe & Decoupled)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { z } from "zod";
import { DeletePresetDialogSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";

type DeleteDialogContent = z.infer<typeof DeletePresetDialogSchema>;

interface DeletePresetDialogProps {
  preset: ThemePreset | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  content: DeleteDialogContent;
}

export function DeletePresetDialog({
  preset,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  content,
}: DeletePresetDialogProps) {
  if (!preset) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.description.replace("...", "")}{" "}
            <span className="font-bold text-foreground">{preset.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{content.cancelButton}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && (
              <DynamicIcon
                name="LoaderCircle"
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {content.confirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
