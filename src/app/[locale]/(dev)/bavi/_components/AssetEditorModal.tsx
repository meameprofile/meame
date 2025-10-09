// src/app/[locale]/(dev)/bavi/_components/AssetEditorModal.tsx
/**
 * @file AssetEditorModal.tsx
 * @description Modal soberano para la edición de activos BAVI. Forjado con
 *              seguridad de tipos absoluta, observabilidad completa y una
 *              arquitectura de composición de élite.
 * @version 2.0.0 (API Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { CldImage, type CldImageProps } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { AssetEditorControls } from "./AssetEditorControls";
import { useAssetEditor } from "@/shared/hooks/bavi/useAssetEditor";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import { logger } from "@/shared/lib/logging";

interface AssetEditorModalProps {
  asset: BaviAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function AssetEditorModal({
  asset,
  isOpen,
  onSaveSuccess,
  onClose,
}: AssetEditorModalProps) {
  const traceId = useMemo(
    () => logger.startTrace("AssetEditorModal_Lifecycle_v2.0"),
    []
  );

  useEffect(() => {
    if (isOpen) {
      logger.info("[AssetEditorModal] Componente visible y operacional.", {
        traceId,
        assetId: asset?.assetId,
      });
    }
    return () => {
      if (isOpen) logger.endTrace(traceId);
    };
  }, [traceId, isOpen, asset]);

  const {
    transformations,
    updateTransformation,
    getTransformedUrl,
    handleSaveAsVariant,
    isPending,
  } = useAssetEditor(asset, onSaveSuccess);

  if (!asset) {
    if (isOpen) {
      logger.warn(
        "[AssetEditorModal] Render abortado: modal abierto sin un activo válido.",
        { traceId }
      );
    }
    return null;
  }

  type CloudinaryEffect = CldImageProps["effects"];

  const activeEffects: CloudinaryEffect = [];
  if (transformations.improve) {
    activeEffects.push({ improve: true });
  }
  // --- [INICIO DE NIVELACIÓN DE CONTRATO v2.0.0] ---
  // La lógica de 'backgroundRemoval' se elimina del array de efectos.
  // if (transformations.removeBackground) {
  //   activeEffects.push({ backgroundRemoval: true }); // ESTO ERA INCORRECTO
  // }
  // --- [FIN DE NIVELACIÓN DE CONTRATO v2.0.0] ---

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-row p-0">
        <div className="w-2/3 h-full flex items-center justify-center bg-muted/20 rounded-l-lg p-4">
          <CldImage
            src={asset.variants[0].publicId}
            alt={`Previsualización de ${asset.assetId}`}
            width={transformations.width || asset.variants[0].dimensions.width}
            height={
              transformations.height || asset.variants[0].dimensions.height
            }
            quality={transformations.quality}
            format={transformations.format}
            // --- [INICIO DE NIVELACIÓN DE CONTRATO v2.0.0] ---
            // Se utiliza la prop de primer nivel correcta para la eliminación de fondo.
            removeBackground={transformations.removeBackground}
            // --- [FIN DE NIVELACIÓN DE CONTRATO v2.0.0] ---
            effects={activeEffects}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="w-1/3 h-full flex flex-col border-l">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <DialogTitle>Editando: {asset.assetId}</DialogTitle>
            <DialogDescription>
              Aplica transformaciones y previsualiza en tiempo real.
            </DialogDescription>
          </DialogHeader>
          <AssetEditorControls
            transformations={transformations}
            onTransformChange={updateTransformation}
            onSave={handleSaveAsVariant}
            isSaving={isPending}
            downloadUrl={getTransformedUrl()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
