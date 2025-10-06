// RUTA: src/shared/hooks/campaign-suite/use-draft-metadata.store.ts
/**
 * @file use-draft-metadata.store.ts
 * @description Store atómico para la metadata y el progreso del borrador.
 * @version 3.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";
import { generateDraftId } from "@/shared/lib/utils/campaign-suite/draft.utils";

interface DraftMetadata {
  draftId: string | null;
  baseCampaignId: string | null;
  variantName: string | null;
  seoKeywords: string | null;
  completedSteps: number[];
  updatedAt: string;
}

interface DraftMetadataActions {
  setMetadata: (data: Partial<Omit<DraftMetadata, "completedSteps">>) => void;
  completeStep: (stepId: number) => void;
  resetMetadata: () => void;
}

const initialState: DraftMetadata = {
  draftId: null,
  baseCampaignId: null,
  variantName: null,
  seoKeywords: null,
  completedSteps: [],
  updatedAt: new Date(0).toISOString(),
};

export const useDraftMetadataStore = create<
  DraftMetadata & DraftMetadataActions
>()(
  persist(
    (set, get) => ({
      ...initialState,
      setMetadata: (data) => {
        const currentState = get();
        let newDraftId = currentState.draftId;

        if (data.baseCampaignId && !currentState.draftId) {
          newDraftId = generateDraftId(data.baseCampaignId);
          logger.success(
            `[MetadataStore] Nuevo draftId generado: ${newDraftId}`
          );
        }

        logger.trace(
          "[MetadataStore] Actualizando metadata del borrador.",
          data
        );
        set((state) => ({
          ...state,
          ...data,
          draftId: newDraftId,
          updatedAt: data.updatedAt || new Date().toISOString(),
        }));
      },
      completeStep: (stepId) => {
        logger.info(`[MetadataStore] Marcando paso ${stepId} como completado.`);
        set((state) => ({
          completedSteps: Array.from(
            new Set([...state.completedSteps, stepId])
          ),
          updatedAt: new Date().toISOString(),
        }));
      },
      resetMetadata: () => {
        logger.warn("[MetadataStore] Reiniciando metadata del borrador.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-metadata",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
