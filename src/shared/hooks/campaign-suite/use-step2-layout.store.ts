// RUTA: src/shared/hooks/campaign-suite/use-step2-layout.store.ts
/**
 * @file use-step2-layout.store.ts
 * @description Store atómico para los datos del Paso 2 (Layout Config).
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";

interface Step2State {
  layoutConfig: LayoutConfigItem[];
}

interface Step2Actions {
  setLayoutConfig: (newLayout: LayoutConfigItem[]) => void;
  resetLayout: () => void;
}

const initialState: Step2State = {
  layoutConfig: [],
};

export const useStep2LayoutStore = create<Step2State & Step2Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setLayoutConfig: (newLayout) => {
        logger.trace("[Step2Store] Reemplazando el layout completo.", { count: newLayout.length });
        set({ layoutConfig: newLayout });
      },
      resetLayout: () => {
        logger.warn("[Step2Store] Reiniciando la configuración del layout.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-step2-layout",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
