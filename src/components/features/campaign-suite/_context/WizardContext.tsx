// app/[locale]/(dev)/dev/campaign-suite/_context/WizardContext.tsx
/**
 * @file WizardContext.tsx
 * @description SSoT para el estado y las acciones de navegación del asistente SDC.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { createContext, useContext } from "react";
import { logger } from "@/shared/lib/logging";

interface WizardContextType {
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export const WizardProvider = WizardContext.Provider;

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (!context) {
    const errorMsg =
      "Error de composición: useWizard debe ser usado dentro de un WizardProvider.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  return context;
};
// app/[locale]/(dev)/dev/campaign-suite/_context/WizardContext.tsx
