// RUTA: src/shared/hooks/campaign-suite/use-campaign-draft-context.store.ts
/**
 * @file use-campaign-draft-context.store.ts
 * @description Store Orquestador de élite para la SDC.
 * @version 17.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import {
  getDraftAction,
  saveDraftAction,
  deleteDraftAction,
} from "@/shared/lib/actions/campaign-suite";
import { useDraftMetadataStore } from "./use-draft-metadata.store";
import { useStep0IdentityStore } from "./use-step0-identity.store";
import { useStep1StructureStore } from "./use-step1-structure.store";
import { useStep2LayoutStore } from "./use-step2-layout.store";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { useStep4ContentStore } from "./use-step4-content.store";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

interface CampaignDraftStoreState {
  isLoading: boolean;
  isSyncing: boolean;
  isHydrated: boolean;
  debounceTimeoutId: NodeJS.Timeout | null;
}

interface CampaignDraftStoreActions {
  initializeDraft: () => Promise<void>;
  triggerDebouncedSave: () => void;
  deleteCurrentDraft: () => Promise<void>;
  resetDraft: () => void;
}

const initialState: CampaignDraftStoreState = {
  isLoading: true,
  isSyncing: false,
  isHydrated: false,
  debounceTimeoutId: null,
};

const resetAllStores = () => {
  useDraftMetadataStore.getState().resetMetadata();
  useStep0IdentityStore.getState().resetStep0Data();
  useStep1StructureStore.getState().reset();
  useStep2LayoutStore.getState().resetLayout();
  useStep3ThemeStore.getState().resetThemeConfig();
  useStep4ContentStore.getState().resetContent();
};

const hydrateAllStores = (draft: CampaignDraft) => {
  useDraftMetadataStore.setState({ ...draft });
  useStep0IdentityStore.setState({ ...draft });
  useStep1StructureStore.setState({ ...draft });
  useStep2LayoutStore.setState({ ...draft });
  useStep3ThemeStore.setState({ ...draft });
  useStep4ContentStore.setState({ ...draft });
};

export const useCampaignDraftStore = create<
  CampaignDraftStoreState & CampaignDraftStoreActions
>((set, get) => ({
  ...initialState,

  initializeDraft: async () => {
    const traceId = logger.startTrace("initializeDraft_v17.0");
    logger.startGroup("[Orchestrator] Inicializando borrador...", traceId);
    set({ isLoading: true });

    try {
      const result = await getDraftAction();
      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data.draft) {
        hydrateAllStores(result.data.draft);
        logger.success(`[Orchestrator] Borrador ${result.data.draft.draftId} hidratado desde DB.`, { traceId });
      } else {
        resetAllStores();
        logger.info("[Orchestrator] No se encontró borrador remoto, iniciando uno nuevo.", { traceId });
      }
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Error desconocido.";
        toast.error("Error al cargar el borrador", { description: msg });
        logger.error("[Orchestrator] Fallo en la inicialización.", { error: msg, traceId });
        resetAllStores();
    } finally {
        set({ isLoading: false, isHydrated: true });
        logger.endGroup();
        logger.endTrace(traceId);
    }
  },

  triggerDebouncedSave: () => {
    const { debounceTimeoutId } = get();
    if (debounceTimeoutId) clearTimeout(debounceTimeoutId);

    const newTimeoutId = setTimeout(async () => {
      const traceId = logger.startTrace("debouncedSave_v17.0");
      logger.startGroup("[Orchestrator] Ejecutando guardado automático...", traceId);
      set({ isSyncing: true });

      const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      const metadata = useDraftMetadataStore.getState();

      if (!metadata.draftId || !activeWorkspaceId) {
        set({ isSyncing: false });
        logger.warn("[Orchestrator] Guardado omitido: falta draftId o workspaceId.", { traceId });
        logger.endGroup();
        logger.endTrace(traceId);
        return;
      }

      const draftToSave: CampaignDraft = {
        ...metadata, ...useStep0IdentityStore.getState(), ...useStep1StructureStore.getState(),
        ...useStep2LayoutStore.getState(), ...useStep3ThemeStore.getState(), ...useStep4ContentStore.getState(),
      };

      const result = await saveDraftAction(draftToSave, activeWorkspaceId);

      if (result.success) {
        useDraftMetadataStore.getState().setMetadata({ updatedAt: result.data.updatedAt });
        logger.success(`[Orchestrator] Borrador ${metadata.draftId} guardado con éxito.`, { traceId });
      } else {
        toast.error("Error al guardar", { description: result.error });
        logger.error("[Orchestrator] Fallo el guardado automático.", { error: result.error, traceId });
      }
      set({ isSyncing: false, debounceTimeoutId: null });
      logger.endGroup();
      logger.endTrace(traceId);
    }, 1500);

    set({ debounceTimeoutId: newTimeoutId });
  },

  deleteCurrentDraft: async () => {
    const traceId = logger.startTrace("deleteCurrentDraft_v17.0");
    logger.startGroup("[Orchestrator] Eliminando borrador actual...", traceId);
    const draftId = useDraftMetadataStore.getState().draftId;
    if (!draftId) {
      logger.warn("[Orchestrator] No hay borrador para eliminar.", { traceId });
      logger.endGroup();
      logger.endTrace(traceId);
      return;
    };

    const result = await deleteDraftAction(draftId);
    if (result.success) {
      resetAllStores();
      toast.success("Borrador eliminado con éxito.");
      logger.success(`[Orchestrator] Borrador ${draftId} eliminado.`, { traceId });
    } else {
      toast.error("Error al eliminar", { description: result.error });
      logger.error("[Orchestrator] Fallo al eliminar borrador.", { error: result.error, traceId });
    }
    logger.endGroup();
    logger.endTrace(traceId);
  },

  resetDraft: () => {
    const traceId = logger.startTrace("resetDraft_v17.0");
    logger.warn("[Orchestrator] Reiniciando borrador a estado inicial.", { traceId });
    resetAllStores();
    logger.endTrace(traceId);
  },
}));

let isSubscribed = false;
if (typeof window !== 'undefined' && !isSubscribed) {
  const onChange = () => {
    if (useCampaignDraftStore.getState().isHydrated) {
      useCampaignDraftStore.getState().triggerDebouncedSave();
    }
  };
  useDraftMetadataStore.subscribe(onChange);
  useStep0IdentityStore.subscribe(onChange);
  useStep1StructureStore.subscribe(onChange);
  useStep2LayoutStore.subscribe(onChange);
  useStep3ThemeStore.subscribe(onChange);
  useStep4ContentStore.subscribe(onChange);
  isSubscribed = true;
  logger.info("[Orchestrator] Suscripción a los stores atómicos activada.");
}
