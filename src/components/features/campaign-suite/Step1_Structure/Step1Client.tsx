// RUTA: src/components/features/campaign-suite/Step1_Structure/Step1Client.tsx
/**
 * @file Step1Client.tsx
 * @description Orquestador de cliente para el Paso 1, nivelado para cumplir
 *              con el contrato de 'exhaustive-deps' de los Hooks de React.
 * @version 14.1.0 (Hook Declaration Order Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import type { z } from "zod";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import { Step1Form } from "./Step1Form";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import type {
  HeaderConfig,
  FooterConfig,
} from "@/shared/lib/types/campaigns/draft.types";
import type { Step1ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step1.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { validateStep1 } from "./step1.validator";

type Step1Content = z.infer<typeof Step1ContentSchema>;

interface Step1ClientProps {
  content: Step1Content;
}

export function Step1Client({ content }: Step1ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step1Client_Lifecycle_v14.1"),
    []
  );
  useEffect(() => {
    logger.info("[Step1Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { draft, updateDraft } = useCampaignDraft();
  const { headerConfig, footerConfig, completedSteps } = draft;

  const wizardContext = useWizard();

  const handleHeaderConfigChange = useCallback(
    (newConfig: Partial<HeaderConfig>) => {
      logger.traceEvent(
        traceId,
        "Acción: Actualizando config de header en el borrador central.",
        newConfig
      );
      updateDraft({ headerConfig: { ...headerConfig, ...newConfig } });
    },
    [updateDraft, headerConfig, traceId] // traceId re-introducido
  );

  const handleFooterConfigChange = useCallback(
    (newConfig: Partial<FooterConfig>) => {
      logger.traceEvent(
        traceId,
        "Acción: Actualizando config de footer en el borrador central.",
        newConfig
      );
      updateDraft({ footerConfig: { ...footerConfig, ...newConfig } });
    },
    [updateDraft, footerConfig, traceId] // traceId re-introducido
  );

  const handleNext = useCallback(() => {
    const nextTraceId = logger.startTrace("Step1Client.handleNext");
    if (wizardContext) {
      try {
        const { isValid, message } = validateStep1(draft);
        if (!isValid) {
          toast.error("Paso Incompleto", { description: message });
          logger.warn(
            `[Guardián Step1] Navegación bloqueada. Causa: ${message}`,
            { traceId: nextTraceId }
          );
          return;
        }
        logger.traceEvent(nextTraceId, "Validación de paso superada.");

        const newCompletedSteps = Array.from(new Set([...completedSteps, 1]));
        updateDraft({ completedSteps: newCompletedSteps });
        wizardContext.goToNextStep();
      } finally {
        logger.endTrace(nextTraceId);
      }
    }
  }, [wizardContext, updateDraft, completedSteps, draft]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 0.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);

  if (!wizardContext) {
    const errorMsg =
      "Guardián de Contexto: Renderizado fuera de WizardProvider.";
    logger.error(`[Step1Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step1Client" errorMessage={errorMsg} />
    );
  }

  if (!content) {
    const errorMsg =
      "Guardián de Contrato: La prop 'content' es nula o indefinida.";
    logger.error(`[Step1Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step1Client" errorMessage={errorMsg} />
    );
  }

  return (
    <Step1Form
      content={content}
      headerConfig={headerConfig}
      footerConfig={footerConfig}
      onHeaderConfigChange={handleHeaderConfigChange}
      onFooterConfigChange={handleFooterConfigChange}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
