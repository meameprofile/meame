// RUTA: src/components/features/campaign-suite/Step4_Content/Step4Client.tsx
/**
 * @file Step4Client.tsx
 * @description Componente Contenedor de Cliente para el Paso 4 (Contenido),
 *              reconstruido para consumir el hook soberano `useAssembledDraft`
 *              y blindado con guardianes y observabilidad de élite.
 * @version 8.0.0 (Sovereign Draft Consumption & Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useStep4ContentStore } from "@/shared/hooks/campaign-suite/use-step4-content.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { Step4Form } from "./Step4Form";
import type { Step4ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step4.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { useAssembledDraft } from "@/shared/hooks/campaign-suite/use-assembled-draft.hook";

type Step4Content = z.infer<typeof Step4ContentSchema>;

interface Step4ClientProps {
  content: Step4Content;
}

export function Step4Client({ content }: Step4ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step4Client_Lifecycle_v8.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step4Client] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const assembledDraft = useAssembledDraft();
  const { setSectionContent } = useStep4ContentStore();
  const { completeStep } = useDraftMetadataStore();
  const wizardContext = useWizard();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleUpdateContent = useCallback(
    (sectionName: string, locale: Locale, field: string, value: unknown) => {
      logger.traceEvent(traceId, "Acción: Actualizando contenido de sección.", {
        sectionName,
        locale,
        field,
      });
      setSectionContent(sectionName, locale, field, value);
    },
    [setSectionContent, traceId]
  );

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 5.");
      completeStep(4);
      wizardContext.goToNextStep();
    }
  }, [completeStep, wizardContext, traceId]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 3.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);

  if (!wizardContext) {
    const errorMsg =
      "Guardián de Contexto: Renderizado fuera de WizardProvider.";
    logger.error(`[Step4Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step4Client" errorMessage={errorMsg} />
    );
  }
  if (!content) {
    const errorMsg =
      "Guardián de Contrato: La prop 'content' es nula o indefinida.";
    logger.error(`[Step4Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step4Client" errorMessage={errorMsg} />
    );
  }

  return (
    <Step4Form
      content={content}
      draft={assembledDraft}
      onEditSection={setEditingSection}
      onCloseEditor={() => setEditingSection(null)}
      editingSection={editingSection}
      onUpdateContent={handleUpdateContent}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
