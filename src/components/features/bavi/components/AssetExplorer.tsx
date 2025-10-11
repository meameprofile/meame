// src/components/features/bavi/components/AssetExplorer.tsx
/**
 * @file AssetExplorer.tsx
 * @description Orquestador de élite para la exploración de activos de BAVI.
 * @version 8.0.0 (Functional Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { z } from "zod";

import { useAssetExplorerLogic } from "@/shared/hooks/bavi/use-asset-explorer-logic";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { BaviAssetExplorerContentSchema } from "@/shared/lib/schemas/pages/bavi-asset-explorer.i18n.schema";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

import { AssetExplorerDisplay } from "./AssetExplorerDisplay";

type CreatorContent = z.infer<typeof PromptCreatorContentSchema>;
type ExplorerContent = z.infer<typeof BaviAssetExplorerContentSchema>;

// --- [INICIO DE NIVELACIÓN DE CONTRATO v8.0.0] ---
interface AssetExplorerProps {
  locale: Locale;
  content: ExplorerContent;
  sesaOptions: CreatorContent["sesaOptions"];
  onAssetSelect?: (asset: BaviAsset) => void;
  onViewDetails: (assetId: string) => void; // Prop restaurada
}
// --- [FIN DE NIVELACIÓN DE CONTRATO v8.0.0] ---

export function AssetExplorer({
  locale,
  content,
  sesaOptions,
  onAssetSelect,
  onViewDetails, // Prop recibida
}: AssetExplorerProps): React.ReactElement {
  logger.info(
    "[AssetExplorer] Renderizando orquestador v8.0 (Functional Integrity)."
  );

  const hookState = useAssetExplorerLogic();

  return (
    <AssetExplorerDisplay
      locale={locale}
      content={content}
      sesaOptions={sesaOptions}
      onAssetSelect={onAssetSelect}
      // --- [INICIO DE NIVELACIÓN DE FLUJO DE DATOS v8.0.0] ---
      // Se pasa la función real en lugar del placeholder.
      onViewDetails={onViewDetails}
      // --- [FIN DE NIVELACIÓN DE FLUJO DE DATOS v8.0.0] ---
      {...hookState}
    />
  );
}
