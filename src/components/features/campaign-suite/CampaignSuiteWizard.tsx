// RUTA: src/components/features/campaign-suite/CampaignSuiteWizard.tsx
/**
 * @file CampaignSuiteWizard.tsx
 * @description Orquestador de cliente y "Layout Shell" para la SDC.
 *              v22.3.0 (Definitive Build Integrity): Se elimina el último
 *              aparato obsoleto ('CampaignDraftSubscriber'), completando
 *              la refactorización y garantizando un build limpio.
 * @version 22.3.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logger } from "@/shared/lib/logging";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { useCampaignDraftStore } from "@/shared/hooks/campaign-suite/use-campaign-draft.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { WizardProvider } from "./_context/WizardContext";
import { ProgressContext, type ProgressStep } from "./_context/ProgressContext";
import { WizardHeader } from "./_components/WizardHeader";
import { WizardClientLayout } from "./_components/WizardClientLayout";
// --- [INICIO DE PURGA FINAL] ---
// La importación del componente obsoleto ha sido eliminada.
// --- [FIN DE PURGA FINAL] ---
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { routes } from "@/shared/lib/navigation";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

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
}: CampaignSuiteWizardProps) {
  const traceId = useMemo(
    () => logger.startTrace("CampaignSuiteWizard_v22.3"),
    []
  );
  useEffect(() => {
    logger.info("[CampaignSuiteWizard] Orquestador de cliente montado.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const isLoading = useCampaignDraftStore((state) => state.isLoading);
  const completedSteps = useDraftMetadataStore((state) => state.completedSteps);

  const currentStepId = useMemo(() => {
    const pathSegments = pathname.split("/");
    const stepSegment = pathSegments[pathSegments.length - 1];
    const stepId = parseInt(stepSegment, 10);
    return isNaN(stepId) ? 0 : stepId;
  }, [pathname]);

  const handleNavigation = useCallback(
    (newStepId: number) => {
      router.push(
        routes.creatorCampaignSuite.path({
          locale,
          stepId: [String(newStepId)],
        })
      );
    },
    [router, locale]
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
    return stepsDataConfig.map((step) => ({
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

  if (!content?.preview || !content?.stepper) {
    return (
      <DeveloperErrorDisplay
        context="CampaignSuiteWizard"
        errorMessage="Contenido i18n incompleto."
      />
    );
  }

  return (
    <WizardProvider value={wizardContextValue}>
      {/* --- [INICIO DE PURGA FINAL] --- */}
      {/* La invocación al componente obsoleto ha sido eliminada. */}
      {/* --- [FIN DE PURGA FINAL] --- */}
      <ProgressContext.Provider value={progressContextValue}>
        <WizardHeader />
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
