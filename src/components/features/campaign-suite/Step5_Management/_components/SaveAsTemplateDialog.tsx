// RUTA: src/components/features/campaign-suite/Step5_Management/_components/SaveAsTemplateDialog.tsx
/**
 * @file SaveAsTemplateDialog.tsx
 * @description Aparato atómico para el diálogo de "Guardar como Plantilla".
 * @version 2.0.0 (Elite Compliance & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import {
  Button,
  DynamicIcon,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";

interface SaveAsTemplateDialogProps {
  onSave: (name: string, description: string) => void;
  isSaving: boolean;
  isDisabled: boolean;
  buttonText: string;
  content: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    saveButton: string;
    cancelButton: string;
  };
}

export function SaveAsTemplateDialog({
  onSave,
  isSaving,
  isDisabled,
  buttonText,
  content,
}: SaveAsTemplateDialogProps): React.ReactElement {
  logger.trace("[SaveAsTemplateDialog] Renderizando v2.0.");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(name, description);
    // No cerramos el diálogo inmediatamente; esperamos a que la operación termine.
    // El padre controlará el estado `isSaving` y podría cerrar el diálogo después.
    // Por ahora, para mantener la simplicidad, cerramos al confirmar.
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isDisabled}>
          <DynamicIcon name="Save" className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-name" className="text-right">
              {content.nameLabel}
            </Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder={content.namePlaceholder}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-desc" className="text-right">
              {content.descriptionLabel}
            </Label>
            <Input
              id="template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
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
