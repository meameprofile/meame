// src/shared/hooks/bavi/use-asset-explorer-logic.ts
/**
 * @file use-asset-explorer-logic.ts
 * @description Hook "cerebro" soberano para la lógica del explorador de activos BAVI.
 * @version 2.0.0 (Holistic Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import { getBaviAssetsAction } from "@/shared/lib/actions/bavi";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

export function useAssetExplorerLogic() {
  const traceId = useMemo(
    () => logger.startTrace("useAssetExplorerLogic_v2.0"),
    []
  );
  const [assets, setAssets] = useState<BaviAsset[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<
    Partial<RaZPromptsSesaTags>
  >({});
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );
  const limit = 9;

  const fetchAssets = useCallback(() => {
    if (!activeWorkspaceId) {
      logger.warn(
        "[useAssetExplorerLogic] Fetch omitido: no hay workspace activo.",
        { traceId }
      );
      return;
    }
    startTransition(async () => {
      // --- [INICIO DE NIVELACIÓN DE CONTRATO v2.0.0] ---
      // La llamada a la acción ahora incluye el workspaceId requerido.
      const result = await getBaviAssetsAction({
        page: currentPage,
        limit,
        query: searchQuery,
        tags: activeFilters,
        workspaceId: activeWorkspaceId,
      });
      // --- [FIN DE NIVELACIÓN DE CONTRATO v2.0.0] ---
      if (result.success) {
        setAssets(result.data.assets);
        setTotalAssets(result.data.total);
      } else {
        toast.error("Error al cargar los activos", {
          description: result.error,
        });
      }
    });
  }, [
    activeWorkspaceId,
    currentPage,
    searchQuery,
    activeFilters,
    limit,
    traceId,
  ]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // fetchAssets se llama a través del useEffect de dependencias.
  }, []);

  const handleFilterChange = useCallback(
    (category: keyof RaZPromptsSesaTags, value: string) => {
      setCurrentPage(1);
      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        if (value === "all") {
          delete newFilters[category];
        } else {
          newFilters[category] = value;
        }
        return newFilters;
      });
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // --- [INICIO DE MEJORA PROACTIVA v2.0.0] ---
  // Se añade la funcionalidad clearFilters que faltaba.
  const clearFilters = useCallback(() => {
    logger.traceEvent(
      traceId,
      "Intención de Usuario: Limpiar todos los filtros."
    );
    setSearchQuery("");
    setActiveFilters({});
    setCurrentPage(1);
  }, [traceId]);
  // --- [FIN DE MEJORA PROACTIVA v2.0.0] ---

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
    clearFilters, // Se exporta la nueva función
    fetchAssets, // Se exporta para refresco manual
  };
}
