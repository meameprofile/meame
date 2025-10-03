// RUTA: src/components/features/campaign-suite/CampaignSuiteWizard.tsx
/**
 * @file CampaignSuiteWizard.tsx
 * @description Orquestador de cliente principal para la SDC, con integridad
 *              arquitectónica restaurada y observabilidad de élite.
 * @version 20.0.0 (Architectural Integrity Restoration & Elite Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import { stepsConfig } from "@/shared/lib/config/campaign-suite/wizard.config";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import {
  useCampaignDraftStore,
  useDraftMetadataStore,
} from "@/shared/hooks/campaign-suite";
import { WizardProvider } from "./_context/WizardContext";
import { ProgressContext, type ProgressStep } from "./_context/ProgressContext";
import { WizardClientLayout } from "./_components/WizardClientLayout";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";
import { DeveloperErrorDisplay } from "../dev-tools";

interface CampaignSuiteWizardProps {
  children: React.ReactNode;
  content: NonNullable<Dictionary["campaignSuitePage"]>;
  loadedFragments: LoadedFragments;
  baviManifest: BaviManifest;
  dictionary: Dictionary;
}

export function CampaignSuiteWizard({
  children,
  content,
  loadedFragments,
  baviManifest,
  dictionary,
}: CampaignSuiteWizardProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("CampaignSuiteWizard_Lifecycle_v20.0"),
    []
  );
  useEffect(() => {
    logger.info("[CampaignSuiteWizard] Orquestador montado y listo.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { initializeDraft, isLoading } = useCampaignDraftStore();
  const { completedSteps } = useDraftMetadataStore();

  useEffect(() => {
    initializeDraft();
  }, [initializeDraft]);

  const currentStepId = useMemo(() => {
    const firstStepId = stepsDataConfig[0].id;
    const stepParam = searchParams.get("step");
    return stepParam ? parseInt(stepParam, 10) : firstStepId;
  }, [searchParams]);

  const handleNavigation = useCallback(
    (newStepId: number) => {
      logger.traceEvent(traceId, `Acción: Navegando al paso ${newStepId}.`);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("step", String(newStepId));
      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams, traceId]
  );

  const handleNextStep = useCallback(
    () => handleNavigation(currentStepId + 1),
    [currentStepId, handleNavigation]
  );
  const handlePrevStep = useCallback(
    () => handleNavigation(currentStepId - 1),
    [currentStepId, handleNavigation]
  );

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (
        completedSteps.includes(stepId) ||
        stepId === currentStepId ||
        completedSteps.includes(stepId - 1)
      ) {
        handleNavigation(stepId);
      }
    },
    [completedSteps, currentStepId, handleNavigation]
  );

  const wizardContextValue = useMemo(
    () => ({ goToNextStep: handleNextStep, goToPrevStep: handlePrevStep }),
    [handleNextStep, handlePrevStep]
  );

  const progressSteps: ProgressStep[] = useMemo(() => {
    return stepsConfig.map((step) => ({
      id: step.id,
      title: content.stepper
        ? content.stepper[step.titleKey as keyof typeof content.stepper]
        : step.titleKey,
      status:
        step.id === currentStepId
          ? "active"
          : completedSteps.includes(step.id)
            ? "completed"
            : "pending",
    }));
  }, [currentStepId, completedSteps, content]);

  const progressContextValue = useMemo(
    () => ({ steps: progressSteps, onStepClick: handleStepClick }),
    [progressSteps, handleStepClick]
  );

  // --- GUARDIÁN DE RESILIENCIA DE CONTRATO ---
  if (!content?.preview || !content?.stepper) {
    const errorMsg =
      "Contrato de UI violado: Faltan claves de contenido para la SDC.";
    logger.error(`[Guardián] ${errorMsg}`, {
      traceId,
      receivedContent: content,
    });
    return (
      <DeveloperErrorDisplay
        context="CampaignSuiteWizard"
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <WizardProvider value={wizardContextValue}>
      <ProgressContext.Provider value={progressContextValue}>
        <WizardClientLayout
          previewContent={content.preview}
          isLoadingDraft={isLoading}
          loadedFragments={loadedFragments}
          baviManifest={baviManifest}
          dictionary={dictionary}
        >
          {children}
        </WizardClientLayout>
      </ProgressContext.Provider>
    </WizardProvider>
  );
}
