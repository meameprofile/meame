// RUTA: src/components/features/bavi/components/AssetUploader.tsx
/**
 * @file AssetUploader.tsx
 * @description Orquestador de UI "cerebro" para la ingesta de activos BAVI.
 *              v4.0.0 (Holistic & Unidirectional Data Flow): Refactorizado para
 *              separar la lógica (hook) de la presentación (componente puro) y
 *              restaurar la integridad de las rutas de importación.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { useAssetUploader } from "@/shared/hooks/bavi/use-asset-uploader";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v4.0.0] ---
// Se importa el componente de presentación desde su ruta relativa interna
// para romper la dependencia circular que causaba el fallo de build.
import { AssetUploaderForm } from "./AssetUploader/components/AssetUploaderForm";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v4.0.0] ---

type UploaderContent = NonNullable<Dictionary["baviUploader"]>;
interface SesaContent {
  sesaLabels: NonNullable<Dictionary["promptCreator"]>["sesaLabels"];
  sesaOptions: NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
}

interface AssetUploaderProps {
  content: UploaderContent;
  sesaContent: SesaContent;
  onUploadSuccess?: () => void;
}

export function AssetUploader({
  content,
  sesaContent,
  onUploadSuccess,
}: AssetUploaderProps) {
  // El hook "cerebro" encapsula toda la lógica.
  const hookState = useAssetUploader({
    content,
    ...sesaContent,
    onUploadSuccess, // Se pasa el callback al hook.
  });

  // El componente de presentación puro recibe todo el estado y los manejadores como props.
  return <AssetUploaderForm {...hookState} />;
}
