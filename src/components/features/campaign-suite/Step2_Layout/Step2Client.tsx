// RUTA: src/components/features/campaign-suite/Step2_Layout/Step2Client.tsx
/**
 * @file Step2Client.tsx
 * @description Componente Contenedor de Cliente para el Paso 2 (Layout), inyectado
 *              con observabilidad de ciclo de vida completo y MEA/UX.
 * @version 7.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { Step2Form } from "./Step2Form";
import { useStep2LayoutStore } from "@/shared/hooks/campaign-suite/use-step2-layout.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { type Step2ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step2.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

type Step2Content = z.infer<typeof Step2ContentSchema>;

interface Step2ClientProps {
  content: Step2Content;
}

export function Step2Client({ content }: Step2ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step2Client_Lifecycle_v7.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step2Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { layoutConfig, setLayoutConfig } = useStep2LayoutStore();
  const { completeStep } = useDraftMetadataStore();
  const wizardContext = useWizard();

  const handleLayoutChange = useCallback(
    (newLayout: LayoutConfigItem[]) => {
      logger.traceEvent(
        traceId,
        "Acción: Layout modificado, actualizando store...",
        { newLayout }
      );
      setLayoutConfig(newLayout);
    },
    [setLayoutConfig, traceId]
  );

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 3.");
      completeStep(2);
      wizardContext.goToNextStep();
    }
  }, [completeStep, wizardContext, traceId]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 1.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);

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
