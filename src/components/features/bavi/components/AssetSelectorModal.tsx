// RUTA: src/components/features/bavi/_components/AssetSelectorModal.tsx
/**
 * @file AssetSelectorModal.tsx
 * @description Orquestador modal de élite para seleccionar un activo de la BAVI.
 * @version 1.0.0
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
import { AssetExplorer } from "./AssetExplorer";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import {
  getBaviI18nContentAction,
  type BaviI18nContent,
} from "@/shared/lib/actions/bavi/getBaviI18nContent.action";

interface AssetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (asset: BaviAsset) => void;
  locale: Locale;
}

export function AssetSelectorModal({
  isOpen,
  onClose,
  onAssetSelect,
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
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
