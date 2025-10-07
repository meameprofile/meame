// RUTA: src/shared/hooks/campaign-suite/use-campaign-draft.store.ts
/**
 * @file use-campaign-draft.store.ts
 * @description Store Soberano y Centralizado para el estado del CampaignDraft.
 *              Esta es la SSoT de la "Forja Centralizada".
 * @version 1.0.0 (Centralized Forge Architecture)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { initialCampaignDraftState } from "@/shared/lib/config/campaign-suite/draft.initial-state";
import { deepMerge } from "@/shared/lib/utils";
import { saveDraftAction } from "@/shared/lib/actions/campaign-suite";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

interface CampaignDraftState {
  draft: CampaignDraft;
  isHydrated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  debounceTimeoutId: NodeJS.Timeout | null;
}

interface CampaignDraftActions {
  setDraft: (draft: CampaignDraft) => void;
  updateDraft: (data: Partial<CampaignDraft>) => void;
  resetDraft: () => void;
  triggerDebouncedSave: () => void;
  setIsLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

const initialState: CampaignDraftState = {
  draft: initialCampaignDraftState,
  isHydrated: false,
  isLoading: true,
  isSyncing: false,
  debounceTimeoutId: null,
};

export const useCampaignDraftStore = create<
  CampaignDraftState & CampaignDraftActions
>()(
  persist(
    (set, get) => ({
      ...initialState,
      setDraft: (draft) => {
        logger.info("[DraftStore] Hidratando store con nuevo borrador.", {
          draftId: draft.draftId,
        });
        set({ draft, isHydrated: true, isLoading: false });
      },
      updateDraft: (data) => {
        logger.trace("[DraftStore] Actualizando borrador.", data);
        set((state) => ({
          draft: deepMerge(state.draft, data),
        }));
        get().triggerDebouncedSave();
      },
      resetDraft: () => {
        logger.warn("[DraftStore] Reiniciando borrador a estado inicial.");
        set({ ...initialState, isLoading: false, isHydrated: true });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      triggerDebouncedSave: () => {
        const { debounceTimeoutId, draft } = get();
        if (debounceTimeoutId) clearTimeout(debounceTimeoutId);

        const newTimeoutId = setTimeout(async () => {
          set({ isSyncing: true });
          const activeWorkspaceId =
            useWorkspaceStore.getState().activeWorkspaceId;

          if (!draft.draftId || !activeWorkspaceId) {
            set({ isSyncing: false });
            return;
          }

          const result = await saveDraftAction(draft, activeWorkspaceId);

          if (result.success) {
            // Actualizamos solo el updatedAt para no disparar otro ciclo de guardado
            set((state) => ({
              draft: { ...state.draft, updatedAt: result.data.updatedAt },
            }));
          } else {
            toast.error("Error en el guardado automático", {
              description: result.error,
            });
          }
          set({ isSyncing: false });
        }, 1500);

        set({ debounceTimeoutId: newTimeoutId });
      },
    }),
    {
      name: "campaign-draft-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isLoading = false;
        }
      },
    }
  )
);
