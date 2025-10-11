// src/components/features/bavi/components/AssetExplorerDisplay.tsx
/**
 * @file AssetExplorerDisplay.tsx
 * @description Componente de presentación puro para la UI del AssetExplorer.
 * @version 7.0.0 (Holistic Contract & Functionality Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect } from "react";
import type { z } from "zod";

import { DynamicIcon, Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

import { AssetCard } from "./AssetCard";

type CreatorContent = z.infer<typeof PromptCreatorContentSchema>;

// Se mantiene el contrato de contenido específico para este componente.
interface AssetExplorerDisplayContent {
  loadingAssets: string;
  noAssetsFoundTitle: string;
  noAssetsFoundDescription: string;
  clearFiltersButton: string;
  previousPageButton: string;
  nextPageButton: string;
  pageInfo: string;
  selectAssetButton: string;
  viewDetailsButton: string; // Se añade para el AssetCard
}

// --- [INICIO DE NIVELACIÓN DE CONTRATO v7.0.0] ---
// Se añade la prop 'clearFilters' a la API del componente.
interface AssetExplorerDisplayProps {
  locale: Locale;
  content: AssetExplorerDisplayContent;
  sesaOptions: CreatorContent["sesaOptions"];
  assets: BaviAsset[];
  isPending: boolean;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  handleFilterChange: (
    category: keyof RaZPromptsSesaTags,
    value: string
  ) => void;
  clearFilters: () => void; // <-- Propiedad añadida
  onViewDetails: (assetId: string) => void;
  onAssetSelect?: (asset: BaviAsset) => void;
}

export function AssetExplorerDisplay({
  locale,
  content,
  sesaOptions,
  assets,
  isPending,
  currentPage,
  totalPages,
  handlePageChange,
  clearFilters, // <-- Se recibe la prop
  onViewDetails,
  onAssetSelect,
}: AssetExplorerDisplayProps): React.ReactElement {
  // --- [FIN DE NIVELACIÓN DE CONTRATO v7.0.0] ---

  const traceId = useMemo(
    () => logger.startTrace("AssetExplorerDisplay_Lifecycle_v7.0"),
    []
  );
  useEffect(() => {
    logger.info("[AssetExplorerDisplay] Componente montado y listo.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const renderContent = () => {
    if (isPending && assets.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <DynamicIcon name="LoaderCircle" className="w-8 h-8 animate-spin" />
          <p className="ml-4">{content.loadingAssets}</p>
        </div>
      );
    }
    if (assets.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <EmptyState
            icon="FilterX"
            title={content.noAssetsFoundTitle}
            description={content.noAssetsFoundDescription}
            actions={
              // --- [INICIO DE NIVELACIÓN DE LÓGICA v7.0.0] ---
              // El botón ahora invoca la función soberana 'clearFilters'.
              <Button variant="outline" onClick={clearFilters}>
                {content.clearFiltersButton}
              </Button>
              // --- [FIN DE NIVELACIÓN DE LÓGICA v7.0.0] ---
            }
          />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <AssetCard
            key={asset.assetId}
            asset={asset}
            locale={locale}
            onViewDetails={onViewDetails}
            onSelectAsset={
              onAssetSelect ? () => onAssetSelect(asset) : undefined
            }
            sesaOptions={sesaOptions}
            selectButtonText={content.selectAssetButton}
            viewDetailsButtonText={content.viewDetailsButton}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 h-full flex flex-col p-6">
      <div className="flex-grow">{renderContent()}</div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-auto pt-4 border-t gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1 || isPending}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <DynamicIcon name="ChevronLeft" className="h-4 w-4 mr-2" />
            {content.previousPageButton}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {content.pageInfo
              .replace("{{currentPage}}", String(currentPage))
              .replace("{{totalPages}}", String(totalPages))}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages || isPending}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {content.nextPageButton}
            <DynamicIcon name="ChevronRight" className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
