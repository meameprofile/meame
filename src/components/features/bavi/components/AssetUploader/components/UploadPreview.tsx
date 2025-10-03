// app/[locale]/(dev)/bavi/_components/AssetUploader/_components/UploadPreview.tsx
/**
 * @file UploadPreview.tsx
 * @description Componente de presentación puro para mostrar el resultado de la subida.
 * @version 1.1.0 (Corruption Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import React from "react";
import type { UploadApiResponse } from "cloudinary";

interface UploadPreviewProps {
  uploadResult: UploadApiResponse | null;
}

export function UploadPreview({ uploadResult }: UploadPreviewProps) {
  if (!uploadResult) return null;

  return (
    <div className="mt-4 p-2 border rounded-md bg-muted/50 text-xs text-muted-foreground">
      <p className="font-semibold text-foreground mb-1">
        Respuesta de Cloudinary:
      </p>
      <pre className="overflow-x-auto">
        {JSON.stringify(uploadResult, null, 2)}
      </pre>
    </div>
  );
}
// app/[locale]/(dev)/bavi/_components/AssetUploader/_components/UploadPreview.tsx
