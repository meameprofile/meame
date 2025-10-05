// RUTA: src/components/features/bavi/components/AssetUploader.tsx
/**
 * @file AssetUploader.tsx
 * @description Orquestador "smart" para la subida de activos.
 * @version 9.0.0 (Holistic Data Flow Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { useAssetUploader } from "@/shared/hooks/bavi/use-asset-uploader";
import { AssetUploaderForm } from "./AssetUploader/components/AssetUploaderForm";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";

interface AssetUploaderProps {
  content: NonNullable<Dictionary["baviUploader"]>;
  sesaLabels: NonNullable<Dictionary["promptCreator"]>["sesaLabels"];
  sesaOptions: NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
}

export function AssetUploader({
  content,
  sesaLabels,
  sesaOptions,
}: AssetUploaderProps) {
  const traceId = logger.startTrace("AssetUploader_Orchestrator_v9.0");
  logger.info("[AssetUploader] Renderizando orquestador de subida.", {
    traceId,
  });

  const uploaderState = useAssetUploader({
    content,
    sesaLabels,
    sesaOptions,
  });

  logger.endTrace(traceId);

  // --- [INICIO DE RESTAURACIÓN DE FLUJO DE DATOS] ---
  // Se pasan TODAS las props del estado del uploader al formulario de presentación.
  return <AssetUploaderForm {...uploaderState} />;
  // --- [FIN DE RESTAURACIÓN DE FLUJO DE DATOS] ---
}
