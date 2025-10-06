// RUTA: src/shared/hooks/campaign-suite/use-step1-structure.store.ts
/**
 * @file use-step1-structure.store.ts
 * @description Store atómico para el Paso 1 (Estructura).
 * @version 5.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";
import type {
  HeaderConfig,
  FooterConfig,
} from "@/shared/lib/types/campaigns/draft.types";
import { deepMerge } from "@/shared/lib/utils";

interface Step1State {
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
}

interface Step1Actions {
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void;
  updateFooterConfig: (config: Partial<FooterConfig>) => void;
  reset: () => void;
}

const initialState: Step1State = {
  headerConfig: { useHeader: true, componentName: null, logoPath: null },
  footerConfig: { useFooter: true, componentName: null },
};

export const useStep1StructureStore = create<Step1State & Step1Actions>()(
  persist(
    (set) => ({
      ...initialState,
      updateHeaderConfig: (config) => {
        logger.trace("[Step1Store] Actualizando config de header.", config);
        set((state) => ({
          headerConfig: deepMerge(state.headerConfig, config),
        }));
      },
      updateFooterConfig: (config) => {
        logger.trace("[Step1Store] Actualizando config de footer.", config);
        set((state) => ({
          footerConfig: deepMerge(state.footerConfig, config),
        }));
      },
      reset: () => {
        logger.warn("[Step1Store] Reiniciando la configuración de estructura.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-step1-structure",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
