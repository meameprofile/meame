// RUTA: src/components/features/bavi/components/AssetUploader.tsx
/**
 * @file AssetUploader.tsx
 * @description Orquestador "smart" para la subida de activos.
 *              v8.0.0 (Architectural Integrity Restoration): Se alinea la
 *              importación del formulario de presentación a su nueva SSoT canónica,
 *              resolviendo el error de build TS2307.
 * @version 8.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { useAssetUploader } from "@/shared/hooks/bavi/use-asset-uploader";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// La importación ahora apunta a la nueva ruta soberana del componente de presentación.
import { AssetUploaderForm } from "./AssetUploader/components/AssetUploaderForm";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
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
  const traceId = logger.startTrace("AssetUploader_Orchestrator_Render_v8.0");
  logger.info("[AssetUploader] Renderizando orquestador de subida.", {
    traceId,
  });

  const uploaderState = useAssetUploader({
    content,
    sesaLabels,
    sesaOptions,
  });

  logger.endTrace(traceId);

  return <AssetUploaderForm {...uploaderState} />;
}
