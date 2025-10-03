// RUTA: src/components/features/campaign-suite/Step1_Structure/Step1Client.tsx
/**
 * @file Step1Client.tsx
 * @description Componente Contenedor de Cliente para el Paso 1, inyectado con
 *              observabilidad de ciclo de vida completo y MEA/UX.
 * @version 9.0.0 (Elite Observability & MEA/UX)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { z } from "zod";
import { logger } from "@/shared/lib/logging";
import { Step1Form } from "./Step1Form";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useStep1StructureStore } from "@/shared/hooks/campaign-suite/use-step1-structure.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { type Step1ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step1.schema";
import type {
  HeaderConfig,
  FooterConfig,
} from "@/shared/lib/types/campaigns/draft.types";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

type Step1Content = z.infer<typeof Step1ContentSchema>;

interface Step1ClientProps {
  content: Step1Content;
}

export function Step1Client({ content }: Step1ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step1Client_Lifecycle_v9.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step1Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { headerConfig, footerConfig, updateHeaderConfig, updateFooterConfig } =
    useStep1StructureStore();
  const { completeStep } = useDraftMetadataStore();
  const wizardContext = useWizard();

  const handleHeaderConfigChange = useCallback(
    (newConfig: Partial<HeaderConfig>) => {
      logger.traceEvent(
        traceId,
        "Acción: Actualizando config de header.",
        newConfig
      );
      updateHeaderConfig(newConfig);
    },
    [updateHeaderConfig, traceId]
  );

  const handleFooterConfigChange = useCallback(
    (newConfig: Partial<FooterConfig>) => {
      logger.traceEvent(
        traceId,
        "Acción: Actualizando config de footer.",
        newConfig
      );
      updateFooterConfig(newConfig);
    },
    [updateFooterConfig, traceId]
  );

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 2.");
      completeStep(1);
      wizardContext.goToNextStep();
    }
  }, [completeStep, wizardContext, traceId]);

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
