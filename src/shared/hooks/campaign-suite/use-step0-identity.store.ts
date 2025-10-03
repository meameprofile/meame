// RUTA: src/shared/hooks/campaign-suite/use-step0-identity.store.ts
/**
 * @file use-step0-identity.store.ts
 * @description Store atómico para el Paso 0, ahora con persistencia en localStorage
 *              para una experiencia de usuario resiliente y sin pérdida de datos.
 * @version 4.0.0 (State Persistence & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/shared/lib/logging";

/**
 * @interface Step0Data
 * @description SSoT para la estructura del estado de este store.
 */
interface Step0Data {
  producer: string | null;
  campaignType: string | null;
}

/**
 * @interface Step0Actions
 * @description SSoT para las acciones que modifican el estado de este store.
 */
interface Step0Actions {
  setStep0Data: (data: Partial<Step0Data>) => void;
  resetStep0Data: () => void;
}

/**
 * @const initialState
 * @description SSoT para el estado inicial del store.
 */
const initialState: Step0Data = {
  producer: null,
  campaignType: null,
};

export const useStep0IdentityStore = create<Step0Data & Step0Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setStep0Data: (data) => {
        logger.trace(
          "[Step0Store] Actualizando y persistiendo datos de identificación.",
          data
        );
        set((state) => ({ ...state, ...data }));
        // La notificación al orquestador para el guardado en DB sigue siendo gestionada
        // por el patrón Observer implementado previamente.
      },
      resetStep0Data: () => {
        logger.warn("[Step0Store] Reiniciando datos de identificación.");
        set(initialState);
      },
    }),
    {
      name: "campaign-draft-step0-identity", // Clave única para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
