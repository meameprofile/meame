// RUTA: src/components/features/bavi/components/AssetSelectorModal.tsx
/**
 * @file AssetSelectorModal.tsx
 * @description Orquestador modal de élite para seleccionar un activo de la BAVI.
 * @version 2.0.0 (Holistic Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Skeleton,
} from "@/components/ui";
import {
  getBaviI18nContentAction,
  type BaviI18nContent,
} from "@/shared/lib/actions/bavi/getBaviI18nContent.action";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

import { AssetExplorer } from "./AssetExplorer";

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO v2.0.0] ---
interface AssetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: BaviAsset) => void;
  onViewDetails: (assetId: string) => void; // <-- Prop requerida añadida al contrato
  locale: Locale;
}
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO v2.0.0] ---

export function AssetSelectorModal({
  isOpen,
  onClose,
  onAssetSelect,
  onViewDetails, // <-- Prop recibida
  locale,
}: AssetSelectorModalProps) {
  const [i18nContent, setI18nContent] = useState<BaviI18nContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchContent = async () => {
        setIsLoading(true);
        const result = await getBaviI18nContentAction(locale);
        if (result.success) {
          setI18nContent(result.data);
        } else {
          logger.error(
            "[AssetSelectorModal] No se pudo cargar el contenido i18n.",
            { error: result.error }
          );
        }
        setIsLoading(false);
      };
      fetchContent();
    }
  }, [isOpen, locale]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        {isLoading || !i18nContent ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {i18nContent.baviUploader.assetSelectorModalTitle}
              </DialogTitle>
              <DialogDescription>
                {i18nContent.baviUploader.assetSelectorModalDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-2">
              <AssetExplorer
                locale={locale}
                content={i18nContent.assetExplorer}
                sesaOptions={i18nContent.sesaOptions}
                onAssetSelect={onAssetSelect}
                onViewDetails={onViewDetails} // <-- Prop delegada al componente hijo
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
