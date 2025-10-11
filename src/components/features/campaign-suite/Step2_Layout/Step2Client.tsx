// RUTA: src/components/features/campaign-suite/Step2_Layout/Step2Client.tsx
/**
 * @file Step2Client.tsx
 * @description Orquestador de cliente para el Paso 2, nivelado para consumir
 *              el store centralizado `useCampaignDraft` y cumplir con los 8 Pilares de Calidad.
 * @version 14.0.0 (Centralized Forge Compliance & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import type { z } from "zod";

import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { logger } from "@/shared/lib/logging";
import type { Step2ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step2.schema";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";

import { Step2Form } from "./Step2Form";

type Step2Content = z.infer<typeof Step2ContentSchema>;

interface Step2ClientProps {
  content: Step2Content;
}

export function Step2Client({ content }: Step2ClientProps): React.ReactElement {
  // --- [INICIO] PILAR III: OBSERVABILIDAD DE CICLO DE VIDA COMPLETO ---
  const traceId = useMemo(
    () => logger.startTrace("Step2Client_Lifecycle_v14.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step2Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);
  // --- [FIN] PILAR III ---

  // --- [INICIO] REFACTORIZACIÓN ARQUITECTÓNICA: FORJA CENTRALIZADA ---
  // Se consume el hook soberano que interactúa con el store central.
  const { draft, updateDraft } = useCampaignDraft();
  const { layoutConfig, completedSteps } = draft;
  // --- [FIN] REFACTORIZACIÓN ARQUITECTÓNICA ---

  const wizardContext = useWizard();

  // --- [INICIO] PILAR I: LÓGICA ATÓMICA Y CENTRALIZADA ---
  const handleLayoutChange = useCallback(
    (newLayout: LayoutConfigItem[]) => {
      logger.traceEvent(
        traceId,
        "Acción: Layout modificado, actualizando borrador central...",
        { newLayout }
      );
      updateDraft({ layoutConfig: newLayout });
    },
    [updateDraft, traceId]
  );

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 3.");
      // La lógica de `completeStep` se integra en la misma acción de actualización.
      const newCompletedSteps = Array.from(new Set([...completedSteps, 2]));
      updateDraft({ completedSteps: newCompletedSteps });
      wizardContext.goToNextStep();
    }
  }, [wizardContext, updateDraft, completedSteps, traceId]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 1.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);
  // --- [FIN] PILAR I ---

  // --- [INICIO] PILARES II Y VII: GUARDIANES DE CONTRATO Y ARQUITECTURA ---
  if (!wizardContext) {
    const errorMsg =
      "Guardián de Contexto: Renderizado fuera de WizardProvider.";
    logger.error(`[Step2Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step2Client" errorMessage={errorMsg} />
    );
  }

  if (!content) {
    const errorMsg =
      "Guardián de Contrato: La prop 'content' es nula o indefinida.";
    logger.error(`[Step2Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step2Client" errorMessage={errorMsg} />
    );
  }
  // --- [FIN] PILARES II Y VII ---

  return (
    <Step2Form
      content={content}
      layoutConfig={layoutConfig}
      onLayoutChange={handleLayoutChange}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
