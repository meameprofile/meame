// RUTA: src/components/features/campaign-suite/Step1_Structure/Step1Client.tsx
/**
 * @file Step1Client.tsx
 * @description Orquestador de cliente para el Paso 1, nivelado para consumir
 *              el store centralizado `useCampaignDraft` y cumplir con los 8 Pilares de Calidad.
 * @version 14.0.0 (Centralized Forge Compliance & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import type { z } from "zod";
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

type Step1Content = z.infer<typeof Step1ContentSchema>;

interface Step1ClientProps {
  content: Step1Content;
}

export function Step1Client({ content }: Step1ClientProps): React.ReactElement {
  // --- [INICIO] PILAR III: OBSERVABILIDAD DE CICLO DE VIDA COMPLETO ---
  const traceId = useMemo(
    () => logger.startTrace("Step1Client_Lifecycle_v14.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step1Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);
  // --- [FIN] PILAR III ---

  // --- [INICIO] REFACTORIZACIÓN ARQUITECTÓNICA: FORJA CENTRALIZADA ---
  // Se consume el hook soberano que interactúa con el store central.
  const { draft, updateDraft } = useCampaignDraft();
  const { headerConfig, footerConfig } = draft;
  // --- [FIN] REFACTORIZACIÓN ARQUITECTÓNICA ---

  const wizardContext = useWizard();

  // --- [INICIO] PILAR I: LÓGICA ATÓMICA Y CENTRALIZADA ---
  // Las acciones de actualización ahora llaman a una única función `updateDraft`,
  // pasando un objeto parcial del borrador, lo que simplifica la lógica.
  const handleHeaderConfigChange = useCallback(
    (newConfig: Partial<HeaderConfig>) => {
      logger.traceEvent(
        traceId,
        "Acción: Actualizando config de header en el borrador central.",
        newConfig
      );
      updateDraft({ headerConfig: { ...headerConfig, ...newConfig } });
    },
    [updateDraft, headerConfig, traceId]
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
    [updateDraft, footerConfig, traceId]
  );
  // --- [FIN] PILAR I ---

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 2.");
      // La lógica de `completeStep` está ahora encapsulada en `updateDraft`.
      updateDraft({ completedSteps: [...draft.completedSteps, 1] });
      wizardContext.goToNextStep();
    }
  }, [wizardContext, updateDraft, draft.completedSteps, traceId]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 0.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);

  // --- [INICIO] PILAR II Y VII: GUARDIANES DE CONTRATO Y ARQUITECTURA ---
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
  // --- [FIN] PILARES II Y VII ---

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
