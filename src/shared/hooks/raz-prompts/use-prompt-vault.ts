// RUTA: src/shared/hooks/raz-prompts/use-prompt-vault.ts
/**
 * @file use-prompt-vault.ts
 * @description Hook "cerebro" para la lógica de la Bóveda de Prompts.
 * @version 6.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useTransition, useCallback, useMemo } from "react";
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
  const traceId = useMemo(() => logger.startTrace("usePromptVault_Lifecycle_v6.0"), []);
  useEffect(() => {
    logger.info("[Hook] usePromptVault montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [prompts, setPrompts] = useState<EnrichedRaZPromptsEntry[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Partial<RaZPromptsSesaTags>>({});
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const limit = 9;

  const fetchPrompts = useCallback((input: GetPromptsInput) => {
    startTransition(async () => {
      const fetchTraceId = logger.startTrace("promptVault.fetchPrompts");
      logger.info("[PromptVault] Iniciando fetch de prompts...", { input, traceId: fetchTraceId });

      const result = await getPromptsAction(input);
      if (result.success) {
        setPrompts(result.data.prompts);
        setTotalPrompts(result.data.total);
        logger.success(`[PromptVault] Fetch exitoso: ${result.data.prompts.length} prompts.`, { traceId: fetchTraceId });
      } else {
        toast.error("Error al cargar prompts", { description: result.error });
        setPrompts([]); setTotalPrompts(0);
        logger.error("[PromptVault] Fetch fallido.", { error: result.error, traceId: fetchTraceId });
      }
      logger.endTrace(fetchTraceId);
    });
  }, []);

  useEffect(() => {
    if (!activeWorkspaceId) {
      logger.warn("[Guardián] Fetch omitido: no hay workspace activo.", { traceId });
      setPrompts([]); setTotalPrompts(0);
      return;
    }
    fetchPrompts({ page: currentPage, limit, query: searchQuery, tags: activeFilters, workspaceId: activeWorkspaceId });
  }, [fetchPrompts, currentPage, searchQuery, activeFilters, limit, activeWorkspaceId, traceId]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    logger.traceEvent(traceId, "Acción: Búsqueda ejecutada.", { query: searchQuery });
    setCurrentPage(1);
  }, [traceId, searchQuery]);

  const handleFilterChange = useCallback((category: keyof RaZPromptsSesaTags, value: string) => {
    logger.traceEvent(traceId, "Acción: Filtro cambiado.", { category, value });
    setActiveFilters(prev => ({ ...prev, [category]: value === "all" ? undefined : value }));
    setCurrentPage(1);
  }, [traceId]);

  const handlePageChange = useCallback((page: number) => {
    logger.traceEvent(traceId, "Acción: Paginación.", { newPage: page });
    setCurrentPage(page);
  }, [traceId]);

  const totalPages = Math.ceil(totalPrompts / limit);

  return { prompts, isPending, currentPage, searchQuery, totalPages, activeFilters, setSearchQuery, handleSearch, handleFilterChange, handlePageChange };
}
