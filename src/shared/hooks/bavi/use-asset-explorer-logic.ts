// RUTA: src/shared/hooks/bavi/use-asset-explorer-logic.ts
/**
 * @file use-asset-explorer-logic.ts
 * @description Hook de lógica de élite para el AssetExplorer.
 * @version 4.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import {
  getBaviAssetsAction,
  type GetBaviAssetsInput,
} from "@/shared/lib/actions/bavi/getBaviAssets.action";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";

export function useAssetExplorerLogic() {
  const traceId = useMemo(() => logger.startTrace("useAssetExplorerLogic_v4.0"), []);
  useEffect(() => {
    logger.info("[AssetExplorer Hook] Montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [assets, setAssets] = useState<BaviAsset[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Partial<RaZPromptsSesaTags>>({});
  const limit = 9;

  const fetchAssets = useCallback((input: GetBaviAssetsInput) => {
    startTransition(async () => {
      const fetchTraceId = logger.startTrace("AssetExplorer.fetchAssets");
      logger.info("[AssetExplorer] Iniciando fetch de activos...", { input, traceId: fetchTraceId });
      const result = await getBaviAssetsAction(input);
      if (result.success) {
        setAssets(result.data.assets);
        setTotalAssets(result.data.total);
        logger.success(`[AssetExplorer] Fetch exitoso. ${result.data.assets.length} activos cargados.`, { traceId: fetchTraceId });
      } else {
        toast.error("Error al cargar activos", { description: result.error });
        setAssets([]);
        setTotalAssets(0);
        logger.error("[AssetExplorer] Fetch fallido.", { error: result.error, traceId: fetchTraceId });
      }
      logger.endTrace(fetchTraceId);
    });
  }, []);

  useEffect(() => {
    fetchAssets({ page: currentPage, limit, query: searchQuery, tags: activeFilters });
  }, [fetchAssets, currentPage, searchQuery, activeFilters, limit]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    logger.traceEvent(traceId, "Acción: Búsqueda ejecutada.", { query: searchQuery });
    setCurrentPage(1); // Esto disparará el useEffect
  }, [traceId, searchQuery]);

  const handleFilterChange = useCallback((category: keyof RaZPromptsSesaTags, value: string) => {
    logger.traceEvent(traceId, "Acción: Filtro cambiado.", { category, value });
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "all") delete newFilters[category];
      else newFilters[category] = value;
      return newFilters;
    });
    setCurrentPage(1);
  }, [traceId]);

  const handlePageChange = useCallback((page: number) => {
    logger.traceEvent(traceId, "Acción: Paginación.", { newPage: page });
    setCurrentPage(page);
  }, [traceId]);

  const totalPages = Math.ceil(totalAssets / limit);

  return { assets, isPending, currentPage, searchQuery, activeFilters, totalPages, setSearchQuery, handleSearch, handleFilterChange, handlePageChange };
}
