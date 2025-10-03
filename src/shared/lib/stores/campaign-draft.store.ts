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
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Se importa el estado inicial desde su SSoT canónica en la capa de configuración.
import { initialCampaignDraftState } from "@/shared/lib/config/campaign-suite/draft.initial-state";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

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
  // --- [INICIO DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---
  // Se elimina el parámetro 'get' que no se está utilizando para satisfacer al linter.
>((set) => ({
  // --- [FIN DE CORRECCIÓN DE HIGIENE DE CÓDIGO] ---
  ...initialState,

  // --- [INICIO DE CORRECCIÓN DE SEGURIDAD DE TIPOS] ---
  // Se añade un tipo explícito al parámetro 'templateDraft'.
  applyTemplate: (templateDraft: CampaignDraft) => {
    // --- [FIN DE CORRECCIÓN DE SEGURIDAD DE TIPOS] ---
    logger.info("[Store] Aplicando plantilla al borrador...", {
      templateName: templateDraft.variantName,
    });
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
