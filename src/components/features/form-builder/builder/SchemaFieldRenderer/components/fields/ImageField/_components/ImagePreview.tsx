// components/forms/builder/SchemaFieldRenderer/_components/fields/ImageField/_components/ImagePreview.tsx
/**
 * @file ImagePreview.tsx
 * @description Componente de presentación puro para mostrar la imagen seleccionada y su acción de eliminación.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
}

export function ImagePreview({ src, alt, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted/20 mb-2 group">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
        aria-label="Eliminar imagen"
      >
        <DynamicIcon name="X" className="h-4 w-4" />
      </Button>
    </div>
  );
}
// components/forms/builder/SchemaFieldRenderer/_components/fields/ImageField/_components/ImagePreview.tsx
