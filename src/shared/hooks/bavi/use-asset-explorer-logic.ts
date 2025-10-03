// RUTA: src/shared/hooks/bavi/use-asset-explorer-logic.ts
/**
 * @file use-asset-explorer-logic.ts
 * @description Hook de lógica de élite para el AssetExplorer, ahora conectado
 *              a la Server Action de producción de Supabase.
 * @version 3.0.0 (Production Data Fetching)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import {
  getBaviAssetsAction,
  type GetBaviAssetsInput,
} from "@/shared/lib/actions/bavi/getBaviAssets.action";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";

export function useAssetExplorerLogic() {
  const [assets, setAssets] = useState<BaviAsset[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<
    Partial<RaZPromptsSesaTags>
  >({});
  const limit = 9; // Podría ser configurable en el futuro

  const fetchAssets = useCallback(
    (input: GetBaviAssetsInput) => {
      startTransition(async () => {
        const result = await getBaviAssetsAction(input);
        if (result.success) {
          setAssets(result.data.assets);
          setTotalAssets(result.data.total);
        } else {
          toast.error("Error al cargar activos", {
            description: result.error,
          });
          setAssets([]);
          setTotalAssets(0);
        }
      });
    },
    [] // No hay dependencias, startTransition es estable
  );

  useEffect(() => {
    logger.trace("[AssetExplorer Logic] Disparando fetch de activos...", {
      page: currentPage,
      query: searchQuery,
      filters: activeFilters,
    });
    fetchAssets({
      page: currentPage,
      limit,
      query: searchQuery,
      tags: activeFilters,
    });
  }, [fetchAssets, currentPage, searchQuery, activeFilters, limit]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (category: keyof RaZPromptsSesaTags, value: string) => {
      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        if (value === "all") {
          delete newFilters[category];
        } else {
          newFilters[category] = value;
        }
        return newFilters;
      });
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const totalPages = Math.ceil(totalAssets / limit);

  return {
    assets,
    isPending,
    currentPage,
    searchQuery,
    activeFilters,
    totalPages,
    setSearchQuery,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  };
}
