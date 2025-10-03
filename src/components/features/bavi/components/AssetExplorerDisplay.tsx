// app/[locale]/(dev)/bavi/_components/AssetExplorerDisplay.tsx
/**
 * @file AssetExplorerDisplay.tsx
 * @description Componente de presentación puro para la UI del AssetExplorer.
 * @version 2.0.0 (FSD Architecture Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  DynamicIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardDescription,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { AssetCard } from "./AssetCard";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
import type { z } from "zod";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

type CreatorContent = z.infer<typeof PromptCreatorContentSchema>;

interface AssetExplorerDisplayProps {
  locale: Locale;
  content: {
    title: string;
    description: string;
    searchPlaceholder: string;
    searchButton: string;
    filterByAILabel: string;
    allAIsOption: string;
    loadingAssets: string;
    noAssetsFoundTitle: string;
    noAssetsFoundDescription: string;
    previousPageButton: string;
    nextPageButton: string;
    pageInfo: string;
    selectAssetButton: string;
  };
  sesaOptions: CreatorContent["sesaOptions"];
  assets: BaviAsset[];
  isPending: boolean;
  currentPage: number;
  searchQuery: string;
  activeFilters: Partial<RaZPromptsSesaTags>;
  totalPages: number;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleFilterChange: (
    category: keyof RaZPromptsSesaTags,
    value: string
  ) => void;
  handlePageChange: (page: number) => void;
  onAssetSelect?: (asset: BaviAsset) => void;
}

export function AssetExplorerDisplay({
  locale,
  content,
  sesaOptions,
  assets,
  isPending,
  currentPage,
  searchQuery,
  totalPages,
  setSearchQuery,
  handleSearch,
  handleFilterChange,
  handlePageChange,
  onAssetSelect,
}: AssetExplorerDisplayProps): React.ReactElement {
  logger.trace(
    "[AssetExplorerDisplay] Renderizando UI de exploración de activos."
  );

  const onViewAssetDetails = (assetId: string) => {
    logger.info(`[AssetExplorerDisplay] Ver detalles del activo: ${assetId}`);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <Input
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={isPending}>
              <DynamicIcon name="Search" className="h-4 w-4 mr-2" />
              {content.searchButton}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mb-6">
            <Select onValueChange={(value) => handleFilterChange("ai", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={content.filterByAILabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{content.allAIsOption}</SelectItem>
                {sesaOptions.ai.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange("sty", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estilos</SelectItem>
                {sesaOptions.sty.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPending && assets.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <DynamicIcon
                name="LoaderCircle"
                className="w-8 h-8 animate-spin"
              />
              <p className="ml-4">{content.loadingAssets}</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <DynamicIcon
                name="FolderOpen"
                className="h-10 w-10 mx-auto mb-4"
              />
              <p className="font-semibold">{content.noAssetsFoundTitle}</p>
              <p className="text-sm mt-2">{content.noAssetsFoundDescription}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.assetId}
                  asset={asset}
                  locale={locale}
                  onViewDetails={onViewAssetDetails}
                  onSelectAsset={onAssetSelect}
                  sesaOptions={sesaOptions}
                  selectButtonText={content.selectAssetButton}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1 || isPending}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <DynamicIcon name="ChevronLeft" className="h-4 w-4 mr-2" />
                {content.previousPageButton}
              </Button>
              <span className="flex items-center text-sm font-medium">
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
        </CardContent>
      </Card>
    </div>
  );
}
// app/[locale]/(dev)/bavi/_components/AssetExplorerDisplay.tsx
