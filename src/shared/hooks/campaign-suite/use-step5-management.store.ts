// RUTA: src/shared/hooks/campaign-suite/use-step5-management.store.ts
/**
 * @file use-step5-management.store.ts
 * @description Store atómico para el estado de UI del Paso 5 (Gestión).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import { logger } from "@/shared/lib/logging";

interface Step5State {
  templateName: string;
  templateDescription: string;
}

interface Step5Actions {
  setTemplateDetails: (details: Partial<Step5State>) => void;
  reset: () => void;
}

const initialState: Step5State = {
  templateName: "",
  templateDescription: "",
};

export const useStep5ManagementStore = create<Step5State & Step5Actions>()(
  (set) => ({
    ...initialState,
    setTemplateDetails: (details) => {
      logger.trace(
        "[Step5Store] Actualizando detalles de la plantilla.",
        details
      );
      set((state) => ({ ...state, ...details }));
    },
    reset: () => {
      logger.trace("[Step5Store] Reiniciando estado del Paso 5.");
      set(initialState);
    },
  })
);
