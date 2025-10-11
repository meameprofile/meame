// src/app/[locale]/(dev)/bavi/_components/BaviPageClient.tsx
/**
 * @file BaviPageClient.tsx
 * @description Orquestador Maestro para la página principal de la BAVI.
 * @version 10.0.0 (React Hooks & Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";

import { AssetExplorerDisplay } from "@/components/features/bavi/components/AssetExplorerDisplay";
import { useAssetExplorerLogic } from "@/shared/hooks/bavi/use-asset-explorer-logic";
import type { BaviI18nContent } from "@/shared/lib/actions/bavi/getBaviI18nContent.action";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

import { AssetEditorModal } from "./AssetEditorModal";
import { AssetPreviewPanel } from "./AssetPreviewPanel";
import { AssetUploaderModal } from "./AssetUploaderModal";
import { BaviHeader } from "./BaviHeader";

interface BaviPageClientProps {
  locale: Locale;
  content: BaviI18nContent;
}

export function BaviPageClient({ locale, content }: BaviPageClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("BaviPageClient_Lifecycle_v10.0"),
    []
  );

  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<BaviAsset | null>(null);
  const [editingAsset, setEditingAsset] = useState<BaviAsset | null>(null);
  const hookState = useAssetExplorerLogic();

  useEffect(() => {
    const groupId = logger.startGroup("[BaviPageClient] Orquestador montado.");
    logger.info("Orquestador Maestro de BAVI operacional.", { traceId });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const handleViewDetails = (assetId: string) => {
    logger.traceEvent(traceId, "Intención de Usuario: Ver Detalles de Activo", {
      assetId,
    });
    const asset = hookState.assets.find((a) => a.assetId === assetId);
    if (asset) {
      setSelectedAsset(asset);
    } else {
      logger.warn(
        "[BaviPageClient] Intento de ver detalles de un activo no encontrado.",
        { assetId, traceId }
      );
    }
  };

  const handleEditAsset = (asset: BaviAsset) => {
    logger.traceEvent(traceId, "Intención de Usuario: Editar Activo", {
      assetId: asset.assetId,
    });
    setSelectedAsset(null);
    setEditingAsset(asset);
  };

  const handleSaveSuccess = () => {
    logger.traceEvent(
      traceId,
      "Evento de Dominio: Edición Guardada con Éxito. Refrescando Bóveda..."
    );
    setEditingAsset(null);
    hookState.fetchAssets();
  };

  // --- [INICIO DE NIVELACIÓN DE REGLAS DE HOOKS v10.0.0] ---
  const handleUploadSuccess = useCallback(() => {
    logger.traceEvent(
      traceId,
      "Evento de Dominio: Subida de Activo Exitosa. Refrescando Bóveda..."
    );
    hookState.fetchAssets();
  }, [hookState, traceId]); // Se añade 'traceId' a las dependencias.
  // --- [FIN DE NIVELACIÓN DE REGLAS DE HOOKS v10.0.0] ---

  const handleOpenUploader = () => {
    logger.traceEvent(traceId, "Intención de Usuario: Abrir Modal de Subida");
    setIsUploaderOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 h-full relative overflow-hidden">
      <BaviHeader
        searchQuery={hookState.searchQuery}
        activeFilters={hookState.activeFilters}
        onSearchChange={hookState.setSearchQuery}
        onFilterChange={hookState.handleFilterChange}
        onSearchSubmit={hookState.handleSearch}
        sesaOptions={content.promptCreator.sesaOptions}
        isPending={hookState.isPending}
        onUploadClick={handleOpenUploader}
        onRefreshClick={hookState.fetchAssets}
        content={content.baviHeader}
      />

      <div className="flex-grow rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <AssetExplorerDisplay
          locale={locale}
          content={content.assetExplorer}
          sesaOptions={content.promptCreator.sesaOptions}
          onAssetSelect={() => {}}
          onViewDetails={handleViewDetails}
          assets={hookState.assets}
          isPending={hookState.isPending}
          currentPage={hookState.currentPage}
          totalPages={hookState.totalPages}
          handlePageChange={hookState.handlePageChange}
          handleFilterChange={hookState.handleFilterChange}
          clearFilters={hookState.clearFilters}
        />
      </div>

      <AssetUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        content={content}
      />

      <AssetPreviewPanel
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onEdit={handleEditAsset}
        sesaOptions={content.promptCreator.sesaOptions}
      />

      <AssetEditorModal
        asset={editingAsset}
        isOpen={!!editingAsset}
        onClose={() => setEditingAsset(null)}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
