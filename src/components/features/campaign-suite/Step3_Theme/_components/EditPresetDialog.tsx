// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/EditPresetDialog.tsx
/**
 * @file EditPresetDialog.tsx
 * @description Aparato de UI atómico para el diálogo de edición de presets.
 * @version 1.1.0 (Type-Safe & Decoupled)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useEffect } from "react";
import type { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Input,
  Label,
  DynamicIcon,
} from "@/components/ui";
import type { EditPresetDialogSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";

type EditDialogContent = z.infer<typeof EditPresetDialogSchema>;

interface EditPresetDialogProps {
  preset: ThemePreset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, description: string) => void;
  isSaving: boolean;
  content: EditDialogContent;
}

export function EditPresetDialog({
  preset,
  isOpen,
  onClose,
  onSave,
  isSaving,
  content,
}: EditPresetDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (preset) {
      setName(preset.name);
      setDescription(preset.description || "");
    }
  }, [preset]);

  if (!preset) return null;

  const handleSave = () => {
    onSave(preset.id, name, description);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {content.title.replace("{{presetName}}", preset.name)}
          </DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name">{content.nameLabel}</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preset-description">
              {content.descriptionLabel}
            </Label>
            <Input
              id="preset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {content.cancelButton}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !name}
          >
            {isSaving && (
              <DynamicIcon
                name="LoaderCircle"
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {content.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
