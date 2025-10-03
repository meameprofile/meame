// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/fields/ImageField/ImageField.tsx
/**
 * @file ImageField.tsx
 * @description Componente de campo de imagen de élite, como un Client Component soberano.
 *              v12.0.0 (Architectural Integrity Restoration): Se corrige la ruta de
 *              importación de AssetSelectorModal a su SSoT canónica en la feature BAVI,
 *              resolviendo un error crítico de build TS2307.
 * @version 12.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";
import { usePathname } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import type { FieldComponentProps } from "../../../_types/field.types";
import { useImageField } from "./_hooks/use-image-field";
import { ImagePreview, ImageFieldActions } from "./_components";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La importación ahora consume la fachada pública de la feature BAVI.
import { AssetSelectorModal } from "@/components/features/bavi/components";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export function ImageField<TFieldValues extends FieldValues>({
  field,
  onValueChange,
  fieldName,
}: FieldComponentProps<TFieldValues>) {
  logger.trace(
    `[ImageField] Renderizando componente de presentación v12.0 para: ${String(fieldName)}`
  );

  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);

  const {
    isUploading,
    isSelectorOpen,
    setIsSelectorOpen,
    handleImageUpload,
    handleRemoveImage,
    handleAssetSelected,
  } = useImageField(onValueChange, fieldName);

  const currentImageValue = field.value as string | null;

  return (
    <div className="space-y-2">
      {currentImageValue && (
        <ImagePreview
          src={currentImageValue}
          alt={`Vista previa para ${String(fieldName)}`}
          onRemove={handleRemoveImage}
        />
      )}
      <ImageFieldActions
        onUpload={handleImageUpload}
        onSelectClick={() => setIsSelectorOpen(true)}
        isUploading={isUploading}
        hasImage={!!currentImageValue}
      />

      {/* El modal se renderiza condicionalmente y recibe sus props de forma segura */}
      {isSelectorOpen && (
        <AssetSelectorModal
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onAssetSelect={handleAssetSelected}
          locale={locale}
        />
      )}
    </div>
  );
}
