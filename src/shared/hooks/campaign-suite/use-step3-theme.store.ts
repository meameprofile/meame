// RUTA: src/shared/hooks/campaign-suite/use-step3-theme.store.ts
/**
 * @file use-step3-theme.store.ts
 * @description Store atómico para los datos del Paso 3 (Configuración de Tema).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import { deepMerge } from "@/shared/lib/utils";

interface Step3State {
  themeConfig: ThemeConfig;
}

interface Step3Actions {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  resetThemeConfig: () => void;
}

const initialState: Step3State = {
  themeConfig: {
    colorPreset: null,
    fontPreset: null,
    radiusPreset: null,
    themeOverrides: {},
  },
};

export const useStep3ThemeStore = create<Step3State & Step3Actions>()(
  persist(
    (set) => ({
      ...initialState,
      updateThemeConfig: (newConfig) => {
        logger.trace(
          "[Step3Store] Actualizando configuración de tema.",
          newConfig
        );
        set((state) => ({
          themeConfig: deepMerge(state.themeConfig, newConfig),
        }));
        // Notificar al orquestador para debounce...
      },
      resetThemeConfig: () => {
        logger.warn("[Step3Store] Reiniciando la configuración de tema.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-step3-theme", // Clave de persistencia granular
      storage: createJSONStorage(() => localStorage),
    }
  )
);
