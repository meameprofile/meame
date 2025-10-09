// RUTA: src/shared/lib/stores/campaign-draft.store.ts
/**
 * @file campaign-draft.store.ts
 * @description Store de Zustand para el estado global del borrador de la SDC.
 * @version 3.1.0 (Holistic Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { initialCampaignDraftState } from "@/shared/lib/config/campaign-suite/draft.initial-state";

// Se define la interfaz del estado y las acciones para un contrato claro.
interface CampaignDraftState {
  draft: CampaignDraft;
  isHydratedFromTemplate: boolean;
  // Añadir aquí otras propiedades de estado si son necesarias en el futuro.
}

interface CampaignDraftActions {
  applyTemplate: (templateDraft: CampaignDraft) => void;
  resetDraft: () => void;
}

// Estado inicial completo, incluyendo propiedades de control.
const initialState: CampaignDraftState = {
  draft: initialCampaignDraftState,
  isHydratedFromTemplate: false,
};

export const useCampaignDraftStore = create<
  CampaignDraftState & CampaignDraftActions
>((set) => ({
  ...initialState,

  applyTemplate: (templateDraft: CampaignDraft) => {
    // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO v3.1.0] ---
    // Se utiliza 'campaignName' en lugar de 'variantName' para alinear con la SSoT.
    logger.info("[Store] Aplicando plantilla al borrador...", {
      templateName: templateDraft.campaignName,
    });
    // --- [FIN DE REFACTORIZACIÓN DE CONTRATO v3.1.0] ---
    set({
      draft: { ...initialCampaignDraftState, ...templateDraft },
      isHydratedFromTemplate: true,
    });
  },

  resetDraft: () => {
    logger.warn("[Store] Reiniciando el borrador al estado inicial.");
    set(initialState);
  },
}));
