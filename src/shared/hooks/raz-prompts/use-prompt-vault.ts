// RUTA: src/shared/hooks/raz-prompts/use-prompt-vault.ts
/**
 * @file use-prompt-vault.ts
 * @description Hook "cerebro" para la lógica de la Bóveda de Prompts (Prompt Vault).
 *              Este aparato orquesta la obtención de datos, el filtrado, la búsqueda y
 *              la paginación de los "genomas creativos" almacenados.
 *
 * @version 7.0.0 (Holistic Observability & Elite Documentation)
 * @author RaZ Podestá - MetaShark Tech
 *
 * @architecture_notes
 * - **Pilar I (Hiper-Atomización)**: Desacopla toda la lógica de estado y obtención
 *   de datos del componente de presentación `PromptVaultDisplay`.
 * - **Pilar III (Observabilidad Profunda)**: Implementa un sistema de tracing robusto
 *   para monitorear el ciclo de vida del hook, cada operación de fetch, y cada
 *   interacción del usuario que desencadena una nueva obtención de datos.
 * - **Pilar VIII (Resiliencia)**: Maneja los estados de error de la Server Action de
 *   forma elegante, notificando al usuario y registrando logs detallados, además
 *   de incluir un `try/catch` para excepciones no esperadas.
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

import {
  getPromptsAction,
  type GetPromptsInput,
  type EnrichedRaZPromptsEntry,
} from "@/shared/lib/actions/raz-prompts";
import { logger } from "@/shared/lib/logging";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

/**
 * @function usePromptVault
 * @description Hook orquestador para la lógica de la Bóveda de Prompts.
 * @returns Un objeto que contiene el estado de la bóveda (prompts, paginación, filtros)
 *          y los manejadores para interactuar con ella.
 */
export function usePromptVault() {
  const traceId = useMemo(
    () => logger.startTrace("usePromptVault_Lifecycle_v7.0"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(`[Hook] usePromptVault montado.`);
    logger.info("Hook para la Bóveda de Prompts inicializado.", { traceId });
    return () => {
      logger.endGroup(groupId);
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

  const fetchPrompts = useCallback((input: GetPromptsInput) => {
    startTransition(async () => {
      const fetchTraceId = logger.startTrace("promptVault.fetchPrompts");
      const groupId = logger.startGroup(
        "[Action Flow] Iniciando fetch de prompts...",
        fetchTraceId
      );
      try {
        const result = await getPromptsAction(input);
        if (result.success) {
          setPrompts(result.data.prompts);
          setTotalPrompts(result.data.total);
          logger.success(
            `[Action Flow] Fetch exitoso. Se cargaron ${result.data.prompts.length} de un total de ${result.data.total} prompts.`,
            { traceId: fetchTraceId }
          );
        } else {
          toast.error("Error al Cargar Prompts", { description: result.error });
          setPrompts([]);
          setTotalPrompts(0);
          logger.error("[Action Flow] Fetch de prompts fallido.", {
            error: result.error,
            traceId: fetchTraceId,
          });
        }
      } catch (exception) {
        const errorMessage =
          exception instanceof Error ? exception.message : "Error desconocido.";
        toast.error("Error Inesperado", {
          description: "Ocurrió un fallo no controlado al buscar prompts.",
        });
        logger.error(
          "[Action Flow] Excepción no controlada durante el fetch de prompts.",
          { error: errorMessage, traceId: fetchTraceId }
        );
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(fetchTraceId);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeWorkspaceId) {
      logger.warn(
        "[Guardián] Fetch de prompts omitido: no hay un workspace activo seleccionado.",
        {
          traceId,
        }
      );
      setPrompts([]);
      setTotalPrompts(0);
      return;
    }
    fetchPrompts({
      page: currentPage,
      limit,
      query: searchQuery,
      tags: activeFilters,
      workspaceId: activeWorkspaceId,
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

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      logger.traceEvent(
        traceId,
        "Acción de Usuario: Búsqueda de prompts ejecutada.",
        {
          query: searchQuery,
        }
      );
      setCurrentPage(1);
    },
    [traceId, searchQuery]
  );

  const handleFilterChange = useCallback(
    (category: keyof RaZPromptsSesaTags, value: string) => {
      logger.traceEvent(
        traceId,
        "Acción de Usuario: Filtro de bóveda cambiado.",
        {
          category,
          value,
        }
      );
      setActiveFilters((previousFilters) => {
        const newFilters = { ...previousFilters };
        if (value === "all") {
          delete newFilters[category];
        } else {
          newFilters[category] = value;
        }
        return newFilters;
      });
      setCurrentPage(1);
    },
    [traceId]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      logger.traceEvent(traceId, "Acción de Usuario: Cambio de página.", {
        newPage: page,
      });
      setCurrentPage(page);
    },
    [traceId]
  );

  const totalPages = Math.ceil(totalPrompts / limit);

  return {
    /** @property {EnrichedRaZPromptsEntry[]} prompts - El array de prompts enriquecidos para la página actual. */
    prompts,
    /** @property {boolean} isPending - Estado booleano que es `true` mientras se obtienen nuevos datos de prompts. */
    isPending,
    /** @property {number} currentPage - El número de la página de resultados actual. */
    currentPage,
    /** @property {string} searchQuery - El valor actual del campo de búsqueda de texto libre. */
    searchQuery,
    /** @property {number} totalPages - El número total de páginas de resultados disponibles. */
    totalPages,
    /** @property {Partial<RaZPromptsSesaTags>} activeFilters - Un objeto que representa los filtros SESA actualmente aplicados. */
    activeFilters,
    /** @property {function} setSearchQuery - Callback para actualizar el estado de la consulta de búsqueda. */
    setSearchQuery,
    /** @property {function} handleSearch - Manejador de evento para ejecutar la búsqueda. */
    handleSearch,
    /** @property {function} handleFilterChange - Callback para actualizar el estado de los filtros SESA. */
    handleFilterChange,
    /** @property {function} handlePageChange - Callback para cambiar la página de resultados. */
    handlePageChange,
  };
}
