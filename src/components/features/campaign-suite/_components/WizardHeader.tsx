// RUTA: src/components/features/campaign-suite/_components/WizardHeader.tsx
/**
 * @file WizardHeader.tsx
 * @description Header de la SDC, con observabilidad y resiliencia de élite.
 * @version 7.0.0 (Resilient & Observable)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressContext } from "../_context/ProgressContext";
import { useCampaignDraftStore } from "@/shared/hooks/campaign-suite/use-campaign-draft-context.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { ProgressStepper } from "./ProgressStepper";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "../../dev-tools";

const SyncStatusIndicator = () => {
  const isSyncing = useCampaignDraftStore((state) => state.isSyncing);
  const updatedAt = useDraftMetadataStore((state) => state.updatedAt);
  const lastSavedTime = new Date(updatedAt).toLocaleTimeString();

  return (
    <div className="flex items-center text-xs text-muted-foreground w-48 justify-end">
      <AnimatePresence mode="wait">
        {isSyncing ? (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1.5"
          >
            <DynamicIcon
              name="LoaderCircle"
              className="h-3 w-3 animate-spin text-primary"
            />
            <span>Guardando...</span>
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1.5"
          >
            <DynamicIcon name="Check" className="h-3 w-3 text-green-500" />
            <span>Guardado a las {lastSavedTime}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function WizardHeader(): React.ReactElement {
  // --- INICIO: PILAR III (FULL OBSERVABILIDAD) ---
  logger.info("[Observabilidad][CLIENTE] Renderizando WizardHeader v7.0.");

  const progressContext = useContext(ProgressContext);

  // --- INICIO: GUARDIÁN DE RESILIENCIA ---
  if (!progressContext) {
    const errorMessage =
      "WizardHeader renderizado fuera de ProgressContext. El stepper no puede funcionar.";
    logger.error(`[Guardián de Resiliencia] ${errorMessage}`);
    // En lugar de retornar null, retornamos un error visible en desarrollo
    // para una depuración inmediata.
    return (
      <DeveloperErrorDisplay
        context="WizardHeader"
        errorMessage={errorMessage}
      />
    );
  }
  // --- FIN: GUARDIÁN DE RESILIENCIA ---

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-48"></div>
      <div className="flex-grow flex items-center justify-center">
        <ProgressStepper
          steps={progressContext.steps}
          onStepClick={progressContext.onStepClick}
        />
      </div>
      <SyncStatusIndicator />
    </div>
  );
}
