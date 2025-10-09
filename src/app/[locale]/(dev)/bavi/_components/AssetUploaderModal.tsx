// RUTA: src/app/[locale]/(dev)/bavi/_components/AssetUploaderModal.tsx
/**
 * @file AssetUploaderModal.tsx
 * @description Modal soberano para la ingesta de nuevos activos en la BAVI.
 * @version 8.0.0 (Sovereign API Consumption)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { AssetUploader } from "@/components/features/bavi/components/AssetUploader";
import type { BaviI18nContent } from "@/shared/lib/actions/bavi/getBaviI18nContent.action";
import { logger } from "@/shared/lib/logging";

interface AssetUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  content: BaviI18nContent;
}

export function AssetUploaderModal({
  isOpen,
  onClose,
  onUploadSuccess,
  content,
}: AssetUploaderModalProps) {
  logger.trace("[AssetUploaderModal] Renderizando modal de subida v8.0.");

  const handleSuccess = () => {
    onUploadSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{content.baviHomePage.ingestCardTitle}</DialogTitle>
          <DialogDescription>
            {content.baviHomePage.ingestCardDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AssetUploader
            content={content.baviUploader}
            sesaContent={{
              sesaLabels: content.promptCreator.sesaLabels,
              sesaOptions: content.sesaOptions,
            }}
            onUploadSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
