// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/CreatePresetDialog.tsx
/**
 * @file CreatePresetDialog.tsx
 * @description Aparato de UI atómico para el diálogo de creación de presets.
 * @version 2.0.0 (Fully Internationalized)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useState } from "react";
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
import type { z } from "zod";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";

type CreateDialogContent = NonNullable<
  z.infer<typeof Step3ContentSchema>["createPresetDialog"]
>;

interface CreatePresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  isSaving: boolean;
  type: "color" | "font" | "geometry";
  content: CreateDialogContent;
}

export function CreatePresetDialog({
  isOpen,
  onClose,
  onSave,
  isSaving,
  type,
  content,
}: CreatePresetDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave(name, description);
    onClose();
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.title.replace("{{type}}", type)}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name">{content.nameLabel}</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={content.namePlaceholder}
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
              placeholder={content.descriptionPlaceholder}
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
