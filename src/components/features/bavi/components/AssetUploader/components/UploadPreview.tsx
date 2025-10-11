// RUTA: src/components/features/bavi/components/AssetUploader/components/UploadPreview.tsx
/**
 * @file UploadPreview.tsx
 * @description Componente de presentación puro para mostrar el resultado de la subida.
 * @version 2.0.0 (MEA/UX Injected & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import type { UploadApiResponse } from "cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

import { logger } from "@/shared/lib/logging";

interface UploadPreviewProps {
  uploadResult: UploadApiResponse | null;
}

export function UploadPreview({ uploadResult }: UploadPreviewProps) {
  logger.trace("[UploadPreview] Renderizando preview de resultado v2.0.");

  return (
    <AnimatePresence>
      {uploadResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mt-4 p-2 border rounded-md bg-muted/50 text-xs text-muted-foreground overflow-hidden"
        >
          <p className="font-semibold text-foreground mb-1">
            Respuesta de Cloudinary:
          </p>
          <pre className="overflow-x-auto">
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
