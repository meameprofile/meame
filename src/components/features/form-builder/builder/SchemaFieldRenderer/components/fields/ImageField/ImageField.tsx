// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/fields/ImageField/ImageField.tsx
/**
 * @file ImageField.tsx
 * @description Componente de campo de imagen de élite, como un Client Component soberano.
 *              v12.1.0 (API Contract Restoration): Se implementa la prop faltante
 *              'onViewDetails' en la invocación de AssetSelectorModal para restaurar
 *              la integridad del contrato y resolver el error de build TS2741.
 * @version 12.1.0
 * @author RaZ Podestá - MetaShark Tech
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
import { AssetSelectorModal } from "@/components/features/bavi/components";

export function ImageField<TFieldValues extends FieldValues>({
  field,
  onValueChange,
  fieldName,
}: FieldComponentProps<TFieldValues>) {
  logger.trace(
    `[ImageField] Renderizando componente de presentación v12.1 para: ${String(
      fieldName
    )}`
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

  // --- [INICIO DE RESTAURACIÓN DE CONTRATO v12.1.0] ---
  // Se crea una función para satisfacer la prop 'onViewDetails' requerida.
  const handleViewDetails = (assetId: string) => {
    logger.info(
      `[ImageField] Intención de usuario: Ver detalles para el activo ${assetId}. (Funcionalidad no implementada en este contexto)`
    );
    // En este flujo, no se abre un panel de detalles, pero se registra la intención.
    // Se podría añadir una notificación toast si fuera necesario.
  };
  // --- [FIN DE RESTAURACIÓN DE CONTRATO v12.1.0] ---

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

      {isSelectorOpen && (
        <AssetSelectorModal
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onAssetSelect={handleAssetSelected}
          onViewDetails={handleViewDetails} // <-- Prop obligatoria ahora proveída
          locale={locale}
        />
      )}
    </div>
  );
}
