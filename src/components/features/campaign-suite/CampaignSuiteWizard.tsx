// RUTA: src/components/features/campaign-suite/CampaignSuiteWizard.tsx
/**
 * @file CampaignSuiteWizard.tsx
 * @description Orquestador de cliente y "Layout Shell" para la SDC,
 *              alineado con la nueva arquitectura zonal inspirada en Canva.
 * @version 23.1.0 (Routing Contract Restoration): Se corrige la clave de ruta
 *              utilizada para la navegación, alineándola con la SSoT de 'navigation.ts'.
 * @author L.I.A. Legacy
 */
"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useMemo, useCallback, useEffect } from "react";

import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { useCampaignDraftStore } from "@/shared/hooks/campaign-suite/use-campaign-draft.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { BaviManifest } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

import { WizardClientLayout } from "./_components/WizardClientLayout";
import { WizardHeader } from "./_components/WizardHeader";
import { ProgressContext, type ProgressStep } from "./_context/ProgressContext";
import { WizardProvider } from "./_context/WizardContext";

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
    () => logger.startTrace("CampaignSuiteWizard_v23.1"),
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
      // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v23.1.0] ---
      // Se utiliza la clave correcta 'creatorCampaignSuiteWithStepId' desde la SSoT.
      router.push(
        routes.creatorCampaignSuiteWithStepId.path({
          locale,
          stepId: [String(newStepId)],
        })
      );
      // --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v23.1.0] ---
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
      <ProgressContext.Provider value={progressContextValue}>
        <div className="space-y-6">
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
        </div>
      </ProgressContext.Provider>
    </WizardProvider>
  );
}
