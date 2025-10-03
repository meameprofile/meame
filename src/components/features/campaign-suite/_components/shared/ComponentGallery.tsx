// RUTA: src/components/features/campaign-suite/_components/shared/ComponentGallery.tsx
/**
 * @file ComponentGallery.tsx
 * @description Componente de UI atómico para mostrar una selección visual.
 * @version 5.1.0 (Sovereign Path Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";
import { cn } from "@/shared/lib/utils/cn";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
import type { GalleryItem } from "@/shared/lib/config/campaign-suite/gallery.config";
import { logger } from "@/shared/lib/logging";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

interface ComponentGalleryProps {
  items: readonly GalleryItem[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  descriptions: {
    [key: string]: string;
  };
}

export function ComponentGallery({
  items,
  selectedValue,
  onValueChange,
  descriptions,
}: ComponentGalleryProps) {
  logger.trace("[ComponentGallery] Renderizando galería v5.1.");
  return (
    <RadioGroup
      value={selectedValue ?? ""}
      onValueChange={onValueChange}
      className="grid grid-cols-1 gap-4"
    >
      {items.map((item) => (
        <Label
          key={item.name}
          htmlFor={item.name}
          className={cn(
            "block cursor-pointer rounded-lg border-2 bg-card p-2 transition-all hover:border-primary/80",
            selectedValue === item.name
              ? "border-primary shadow-lg ring-2 ring-primary/50"
              : "border-muted/50"
          )}
        >
          <RadioGroupItem
            value={item.name}
            id={item.name}
            className="sr-only"
          />
          <div
            className="relative w-full overflow-hidden rounded-md bg-muted/30"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src={item.previewImage}
              alt={`Vista previa de ${item.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="p-2 text-center">
            <p className="font-semibold text-foreground text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {descriptions[item.name] || "Descripción no encontrada"}
            </p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
// RUTA: src/components/features/campaign-suite/_components/shared/ComponentGallery.tsx
