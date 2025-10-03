// components/forms/builder/SchemaFieldRenderer/_components/fields/ImageField/_components/ImageFieldActions.tsx
/**
 * @file ImageFieldActions.tsx
 * @description Componente de presentación puro para las acciones de subida y selección de imágenes.
 * @version 1.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button, DynamicIcon, ImageUploader } from "@/components/ui";

interface ImageFieldActionsProps {
  onUpload: (formData: FormData) => Promise<void>;
  onSelectClick: () => void;
  isUploading: boolean;
  hasImage: boolean;
}

export function ImageFieldActions({
  onUpload,
  onSelectClick,
  isUploading,
  hasImage,
}: ImageFieldActionsProps) {
  return (
    <div className="space-y-2">
      <ImageUploader
        onUpload={async (formData) => {
          await onUpload(formData);
          // La acción onUpload ya maneja el resultado, no necesitamos devolver un ActionResult aquí.
          return { success: true, data: { path: "" } };
        }}
        onUploadSuccess={() => {}}
        content={{
          dropzoneText: hasImage
            ? "Cambiar Imagen"
            : "Arrastrar o Subir Archivo",
          dropzoneSubtext: "PNG, JPG, SVG hasta 2MB",
          loadingText: "Subiendo...",
        }}
        className="w-full"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isUploading}
        onClick={onSelectClick}
      >
        <DynamicIcon name="LibraryBig" className="mr-2 h-4 w-4" />
        Seleccionar de la Biblioteca
      </Button>
    </div>
  );
}
// components/forms/builder/SchemaFieldRenderer/_components/fields/ImageField/_components/ImageFieldActions.tsx
