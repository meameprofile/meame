// RUTA: src/shared/hooks/campaign-suite/use-campaign-draft.store.ts
/**
 * @file use-campaign-draft.store.ts
 * @description Store Soberano y Centralizado para el estado del CampaignDraft.
 *              v3.0.0 (Contract Integrity Restoration): Se alinea la
 *              sincronización con el `useDraftMetadataStore` para usar
 *              `campaignName` y `seoKeywords` con los tipos correctos.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { initialCampaignDraftState } from "@/shared/lib/config/campaign-suite/draft.initial-state";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { deepMerge } from "@/shared/lib/utils";

import { useDraftMetadataStore } from "./use-draft-metadata.store";

interface CampaignDraftState {
  draft: CampaignDraft;
  isHydrated: boolean;
  isLoading: boolean;
  isSyncing: boolean; // Se añade la propiedad para integridad
}

interface CampaignDraftActions {
  setDraft: (draft: CampaignDraft) => void;
  updateDraft: (data: Partial<CampaignDraft>) => void;
  resetDraft: () => void;
  setIsLoading: (loading: boolean) => void;
  setIsSyncing: (syncing: boolean) => void; // Se añade la acción
}

const initialState: CampaignDraftState = {
  draft: initialCampaignDraftState,
  isHydrated: false,
  isLoading: true,
  isSyncing: false,
};

export const useCampaignDraftStore = create<
  CampaignDraftState & CampaignDraftActions
>()(
  persist(
    (set) => ({
      ...initialState,
      setDraft: (draft) => {
        logger.info("[DraftStore] Hidratando store con nuevo borrador.", {
          draftId: draft.draftId,
        });
        useDraftMetadataStore.getState().setMetadata({
          draftId: draft.draftId,
          baseCampaignId: draft.baseCampaignId,
          campaignName: draft.campaignName,
          seoKeywords: draft.seoKeywords,
          updatedAt: draft.updatedAt,
        });
        set({ draft, isHydrated: true, isLoading: false });
      },
      updateDraft: (data) => {
        set((state) => {
          const newDraft = deepMerge(state.draft, data);
          useDraftMetadataStore.getState().setMetadata({
            ...data,
            updatedAt: new Date().toISOString(),
          });
          return { draft: newDraft };
        });
      },
      resetDraft: () => {
        logger.warn("[DraftStore] Reiniciando borrador a estado inicial.");
        useDraftMetadataStore.getState().resetMetadata();
        set({ ...initialState, isLoading: false, isHydrated: true });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsSyncing: (syncing) => set({ isSyncing: syncing }),
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
