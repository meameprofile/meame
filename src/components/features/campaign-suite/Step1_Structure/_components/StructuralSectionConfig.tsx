// RUTA: src/components/features/campaign-suite/Step1_Structure/_components/StructuralSectionConfig.tsx
/**
 * @file StructuralSectionConfig.tsx
 * @description Componente de UI atómico y reutilizable para la configuración
 *              de una sección estructural (Header/Footer).
 * @version 1.0.0 (Forged & Elite)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { ComponentGallery } from "@/components/features/campaign-suite/_components/shared/ComponentGallery";
import type { GalleryItem } from "@/shared/lib/config/campaign-suite/gallery.config";
import { logger } from "@/shared/lib/logging";

interface StructuralSectionConfigProps {
  switchId: string;
  switchLabel: string;
  galleryTitle: string;
  isEnabled: boolean;
  onToggle: (isEnabled: boolean) => void;
  galleryItems: readonly GalleryItem[];
  selectedValue: string | null;
  onSelectionChange: (value: string) => void;
  descriptions: { [key: string]: string };
}

export function StructuralSectionConfig({
  switchId,
  switchLabel,
  galleryTitle,
  isEnabled,
  onToggle,
  galleryItems,
  selectedValue,
  onSelectionChange,
  descriptions,
}: StructuralSectionConfigProps): React.ReactElement {
  logger.trace(`[StructuralSectionConfig] Renderizando para: ${switchLabel}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label htmlFor={switchId} className="font-semibold">
          {switchLabel}
        </Label>
        <Switch id={switchId} checked={isEnabled} onCheckedChange={onToggle} />
      </div>

      {isEnabled && (
        <div>
          <h3 className="text-md font-semibold mb-4">{galleryTitle}</h3>
          <ComponentGallery
            items={galleryItems}
            selectedValue={selectedValue}
            onValueChange={onSelectionChange}
            descriptions={descriptions}
          />
        </div>
      )}
    </div>
  );
}
