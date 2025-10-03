// RUTA: src/components/features/campaign-suite/Step4_Content/ContentEditor/ContentEditorHeader.tsx
/**
 * @file ContentEditorHeader.tsx
 * @description Aparato de presentación atómico para el encabezado del editor de contenido.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";

interface ContentEditorHeaderProps {
  sectionName: string;
  onClose: () => void;
}

export function ContentEditorHeader({
  sectionName,
  onClose,
}: ContentEditorHeaderProps): React.ReactElement {
  logger.trace("[ContentEditorHeader] Renderizando.");
  return (
    <header className="p-4 border-b flex items-center justify-between flex-shrink-0">
      <h2 className="text-lg font-semibold text-foreground">
        Editando Contenido: <span className="text-primary">{sectionName}</span>
      </h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <DynamicIcon name="X" className="h-4 w-4" />
        <span className="sr-only">Cerrar editor</span>
      </Button>
    </header>
  );
}
