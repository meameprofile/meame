// RUTA: src/components/features/campaign-suite/Step5_Management/_components/DeleteDraftDialog.tsx
/**
 * @file DeleteDraftDialog.tsx
 * @description Aparato atómico para el diálogo de confirmación de eliminación de
 *              borrador, con una UX de "alta fricción" para máxima seguridad.
 * @version 2.1.0 (Holistic Contract & Elite Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";
import React, { useState } from "react";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type DeleteDialogContent = NonNullable<
  NonNullable<Dictionary["campaignSuitePage"]>["step5"]
>["deleteDialog"];

interface DeleteDraftDialogProps {
  content: DeleteDialogContent;
  draftName: string;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function DeleteDraftDialog({
  content,
  draftName,
  onConfirmDelete,
  isDeleting,
}: DeleteDraftDialogProps): React.ReactElement {
  logger.trace("[DeleteDraftDialog] Renderizando v2.1 (Holistic).");

  const [draftNameInput, setDraftNameInput] = useState("");
  const [confirmationTextInput, setConfirmationTextInput] = useState("");
  const CONFIRMATION_PHRASE = "autorizo delete";

  const isConfirmationMatch =
    draftNameInput === draftName &&
    confirmationTextInput === CONFIRMATION_PHRASE;

  const handleCancel = () => {
    setDraftNameInput("");
    setConfirmationTextInput("");
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{content.title}</AlertDialogTitle>
        <AlertDialogDescription>{content.description}</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="draft-name-confirm">{content.draftNameLabel}</Label>
          <Input
            id="draft-name-confirm"
            value={draftNameInput}
            onChange={(e) => setDraftNameInput(e.target.value)}
            placeholder={draftName}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmation-text">
            {content.confirmationTextLabel}
          </Label>
          <Input
            id="confirmation-text"
            value={confirmationTextInput}
            onChange={(e) => setConfirmationTextInput(e.target.value)}
            placeholder={content.confirmationTextPlaceholder}
            autoComplete="off"
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCancel}>
          {content.cancelButton}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirmDelete}
          disabled={!isConfirmationMatch || isDeleting}
          className="bg-destructive hover:bg-destructive/90"
        >
          {content.confirmButton}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
