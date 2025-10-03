// RUTA: src/shared/hooks/campaign-suite/use-campaign-draft-context.store.ts
/**
 * @file use-campaign-draft-context.store.ts
 * @description Store Orquestador de élite para la SDC. Implementa el patrón
 *              Observer para una lógica de auto-guardado desacoplada y está
 *              forjado con seguridad de tipos absoluta y resiliencia.
 * @version 15.0.0 (Absolute Type Safety Restoration)
 *@author RaZ Podestá - MetaShark Tech
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

// --- SSoT de Contratos Internos ---

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

// --- Funciones Puras de Manipulación de Estado Atómico ---

const resetAllStores = () => {
  logger.warn(
    "[DraftOrchestrator] Reiniciando todos los stores atómicos al estado inicial."
  );
  useDraftMetadataStore.getState().resetMetadata();
  useStep0IdentityStore.getState().resetStep0Data();
  useStep1StructureStore.getState().reset();
  useStep2LayoutStore.getState().resetLayout();
  useStep3ThemeStore.getState().resetThemeConfig();
  useStep4ContentStore.getState().resetContent();
};

const hydrateAllStores = (draft: CampaignDraft) => {
  logger.info(
    "[DraftOrchestrator] Hidratando todos los stores atómicos desde el borrador de la base de datos."
  );
  useDraftMetadataStore.setState({
    ...useDraftMetadataStore.getState(),
    draftId: draft.draftId,
    baseCampaignId: draft.baseCampaignId,
    variantName: draft.variantName,
    seoKeywords: draft.seoKeywords,
    completedSteps: draft.completedSteps,
    updatedAt: draft.updatedAt,
  });
  useStep0IdentityStore.setState({
    producer: draft.producer,
    campaignType: draft.campaignType,
  });
  useStep1StructureStore.setState({
    headerConfig: draft.headerConfig,
    footerConfig: draft.footerConfig,
  });
  useStep2LayoutStore.setState({ layoutConfig: draft.layoutConfig });
  useStep3ThemeStore.setState({ themeConfig: draft.themeConfig });
  useStep4ContentStore.setState({ contentData: draft.contentData });
};

// --- Store Orquestador Principal ---

export const useCampaignDraftStore = create<
  CampaignDraftStoreState & CampaignDraftStoreActions
>((set, get) => ({
  ...initialState,

  initializeDraft: async () => {
    const traceId = logger.startTrace("initializeDraft_v15.0");
    logger.startGroup("[DraftOrchestrator] Inicializando borrador...");
    set({ isLoading: true });

    const result = await getDraftAction();

    if (!result.success) {
      toast.error("Error al cargar el borrador", { description: result.error });
      logger.error("[DraftOrchestrator] Fallo la carga del borrador.", {
        error: result.error,
        traceId,
      });
      resetAllStores();
    } else if (result.data.draft) {
      hydrateAllStores(result.data.draft);
    } else {
      resetAllStores();
    }
    set({ isLoading: false, isHydrated: true });
    logger.endGroup();
    logger.endTrace(traceId);
  },

  triggerDebouncedSave: () => {
    const { debounceTimeoutId } = get();
    if (debounceTimeoutId) clearTimeout(debounceTimeoutId);

    const newTimeoutId = setTimeout(async () => {
      const traceId = logger.startTrace("debouncedSave_v15.0");
      logger.startGroup(
        "[DraftOrchestrator] Ejecutando guardado automático..."
      );
      set({ isSyncing: true });

      const metadata = useDraftMetadataStore.getState();
      const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;

      if (!metadata.draftId || !activeWorkspaceId) {
        set({ isSyncing: false });
        logger.warn(
          "[DraftOrchestrator] Guardado omitido: falta draftId o workspaceId.",
          { traceId, draftId: metadata.draftId, workspaceId: activeWorkspaceId }
        );
        logger.endGroup();
        logger.endTrace(traceId);
        return;
      }

      // --- [INICIO DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---
      // Se construye el payload explícitamente para asegurar a TypeScript que
      // `draftId` es un `string` después del guardián anterior.
      const result = await saveDraftAction({
        draftId: metadata.draftId,
        baseCampaignId: metadata.baseCampaignId,
        variantName: metadata.variantName,
        seoKeywords: metadata.seoKeywords,
        completedSteps: metadata.completedSteps,
        updatedAt: metadata.updatedAt,
        ...useStep0IdentityStore.getState(),
        ...useStep1StructureStore.getState(),
        ...useStep2LayoutStore.getState(),
        ...useStep3ThemeStore.getState(),
        ...useStep4ContentStore.getState(),
        workspaceId: activeWorkspaceId,
      });
      // --- [FIN DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS] ---

      if (result.success) {
        useDraftMetadataStore
          .getState()
          .setMetadata({ updatedAt: result.data.updatedAt });
      } else {
        toast.error("Error al guardar", { description: result.error });
        logger.error("[DraftOrchestrator] Fallo el guardado del borrador.", {
          error: result.error,
          traceId,
        });
      }
      set({ isSyncing: false, debounceTimeoutId: null });
      logger.endGroup();
      logger.endTrace(traceId);
    }, 1500);

    set({ debounceTimeoutId: newTimeoutId });
  },

  deleteCurrentDraft: async () => {
    const draftId = useDraftMetadataStore.getState().draftId;
    if (!draftId) {
      toast.info("No hay un borrador activo para eliminar.");
      return;
    }
    const result = await deleteDraftAction(draftId);
    if (result.success) {
      resetAllStores();
      toast.success("Borrador eliminado con éxito.");
    } else {
      toast.error("Error al eliminar el borrador", {
        description: result.error,
      });
    }
  },

  resetDraft: () => {
    resetAllStores();
  },
}));

// --- Patrón Observer para Auto-Guardado ---

let isSubscribed = false;
const subscribeToChanges = () => {
  if (isSubscribed) return;

  const onChange = () => {
    if (useCampaignDraftStore.getState().isHydrated) {
      useCampaignDraftStore.getState().triggerDebouncedSave();
    }
  };

  useStep0IdentityStore.subscribe(onChange);
  useStep1StructureStore.subscribe(onChange);
  useStep2LayoutStore.subscribe(onChange);
  useStep3ThemeStore.subscribe(onChange);
  useStep4ContentStore.subscribe(onChange);

  isSubscribed = true;
  logger.info(
    "[DraftOrchestrator] Suscrito a los cambios de los stores atómicos para auto-guardado."
  );
};

subscribeToChanges();
