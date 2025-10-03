// RUTA: src/shared/hooks/raz-prompts/use-prompt-vault.ts
/**
 * @file use-prompt-vault.ts
 * @description Hook "cerebro" para la lógica de la Bóveda de Prompts.
 *              Forjado con un guardián de resiliencia de contexto, observabilidad
 *              holística y alineado con los 8 Pilares de Calidad.
 * @version 5.0.0 (Elite Resilience & Holistic Observability)
 *@author RaZ Podestá - MetaShark Tech
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
import {
  getPromptsAction,
  type GetPromptsInput,
  type EnrichedRaZPromptsEntry,
} from "@/shared/lib/actions/raz-prompts";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

export function usePromptVault() {
  const traceId = useMemo(
    () => logger.startTrace("usePromptVault_Lifecycle_v5.0"),
    []
  );

  useEffect(() => {
    logger.info("[Hook] usePromptVault montado.", { traceId });
    return () => {
      logger.info("[Hook] usePromptVault desmontado.", { traceId });
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const [prompts, setPrompts] = useState<EnrichedRaZPromptsEntry[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
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

  const fetchPrompts = useCallback(
    (input: GetPromptsInput) => {
      startTransition(async () => {
        const fetchTraceId = logger.startTrace("usePromptVault.fetchPrompts");
        logger.traceEvent(fetchTraceId, "Iniciando fetch de prompts...", {
          input,
        });

        const result = await getPromptsAction(input);

        if (result.success) {
          logger.traceEvent(fetchTraceId, "Fetch de prompts exitoso.", {
            count: result.data.prompts.length,
          });
          setPrompts(result.data.prompts);
          setTotalPrompts(result.data.total);
        } else {
          logger.error("[usePromptVault] Fetch de prompts fallido.", {
            error: result.error,
            traceId: fetchTraceId,
          });
          toast.error("Error al cargar prompts", {
            description: result.error,
          });
          setPrompts([]);
          setTotalPrompts(0);
        }
        logger.endTrace(fetchTraceId);
      });
    },
    [startTransition]
  );

  useEffect(() => {
    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTEXTO ---
    if (!activeWorkspaceId) {
      logger.warn(
        "[usePromptVault] Fetch omitido: no hay un workspace activo.",
        { traceId }
      );
      // Limpiamos los resultados si el workspace cambia a nulo.
      setPrompts([]);
      setTotalPrompts(0);
      return;
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTEXTO ---

    logger.traceEvent(traceId, "Disparando fetch de prompts...", {
      page: currentPage,
      query: searchQuery,
      filters: activeFilters,
      workspaceId: activeWorkspaceId,
    });
    fetchPrompts({
      page: currentPage,
      limit,
      query: searchQuery,
      tags: activeFilters,
    });
  }, [
    fetchPrompts,
    currentPage,
    searchQuery,
    activeFilters,
    limit,
    activeWorkspaceId,
    traceId,
  ]);

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

  const totalPages = Math.ceil(totalPrompts / limit);

  return {
    prompts,
    isPending,
    currentPage,
    searchQuery,
    totalPages,
    activeFilters,
    setSearchQuery,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  };
}
