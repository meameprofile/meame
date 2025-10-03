// RUTA: src/shared/lib/stores/use-workspace.store.ts
/**
 * @file use-workspace.store.ts
 * @description Store de Zustand y SSoT para gestionar el estado del workspace,
 *              ahora con lógica de fallback resiliente para el workspace activo.
 * @version 3.1.0 (Export Integrity Restoration)
 * @author L.I.A. Legacy
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";
import type { Workspace } from "@/shared/lib/schemas/entities/workspace.schema";
import type { CampaignTemplate } from "@/shared/lib/schemas/campaigns/template.schema";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  availableWorkspaces: Workspace[];
  templates: CampaignTemplate[];
  isLoadingTemplates: boolean;
}

interface WorkspaceActions {
  setActiveWorkspace: (workspaceId: string) => void;
  setAvailableWorkspaces: (workspaces: Workspace[]) => void;
  setTemplates: (templates: CampaignTemplate[]) => void;
  setLoadingTemplates: (isLoading: boolean) => void;
  clearWorkspaceState: () => void;
}

const initialState: WorkspaceState = {
  activeWorkspaceId: null,
  availableWorkspaces: [],
  templates: [],
  isLoadingTemplates: true,
};

// --- [INICIO DE CORRECCIÓN DE INTEGRIDAD DE BUILD] ---
// Se añade la palabra clave 'export' para hacer el store accesible a otros módulos.
export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  // --- [FIN DE CORRECCIÓN DE INTEGRIDAD DE BUILD] ---
  persist(
    (set, get) => ({
      ...initialState,
      setActiveWorkspace: (workspaceId) => {
        const currentActiveId = get().activeWorkspaceId;
        if (currentActiveId !== workspaceId) {
          logger.info(
            `[WorkspaceStore] Cambiando workspace activo a: ${workspaceId}. Invalidando caché de plantillas.`
          );
          set({
            activeWorkspaceId: workspaceId,
            templates: [],
            isLoadingTemplates: true,
          });
        }
      },
      setAvailableWorkspaces: (workspaces) => {
        set((state) => {
          const currentActiveId = state.activeWorkspaceId;
          const activeWorkspaceStillExists = workspaces.some(
            (ws) => ws.id === currentActiveId
          );

          if (!currentActiveId || !activeWorkspaceStillExists) {
            const newActiveId = workspaces[0]?.id || null;
            logger.info(
              `[WorkspaceStore] Lógica de fallback activada. Nuevo workspace activo: ${newActiveId}`
            );
            return {
              availableWorkspaces: workspaces,
              activeWorkspaceId: newActiveId,
              templates: [],
              isLoadingTemplates: true,
            };
          }

          return { availableWorkspaces: workspaces };
        });
      },
      setTemplates: (templates) => {
        logger.info(
          `[WorkspaceStore] Cacheando ${templates.length} plantillas.`
        );
        set({ templates, isLoadingTemplates: false });
      },
      setLoadingTemplates: (isLoading) => {
        set({ isLoadingTemplates: isLoading });
      },
      clearWorkspaceState: () => {
        logger.warn(
          "[WorkspaceStore] Limpiando estado del workspace (logout)."
        );
        set(initialState);
      },
    }),
    {
      name: "workspace-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
