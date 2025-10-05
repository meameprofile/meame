// RUTA: src/shared/hooks/campaign-suite/use-step0-identity.store.ts
/**
 * @file use-step0-identity.store.ts
 * @description Store atómico para el Paso 0.
 * @version 5.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";

interface Step0Data {
  producer: string | null;
  campaignType: string | null;
}

interface Step0Actions {
  setStep0Data: (data: Partial<Step0Data>) => void;
  resetStep0Data: () => void;
}

const initialState: Step0Data = {
  producer: null,
  campaignType: null,
};

export const useStep0IdentityStore = create<Step0Data & Step0Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setStep0Data: (data) => {
        logger.trace("[Step0Store] Actualizando y persistiendo datos.", data);
        set((state) => ({ ...state, ...data }));
      },
      resetStep0Data: () => {
        logger.warn("[Step0Store] Reiniciando datos de identificación.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-step0-identity",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
