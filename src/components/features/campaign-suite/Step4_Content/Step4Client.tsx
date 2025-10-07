// RUTA: src/components/features/campaign-suite/Step4_Content/Step4Client.tsx
/**
 * @file Step4Client.tsx
 * @description Orquestador de cliente para el Paso 4, nivelado con un guardián
 *              de validación proactivo y observabilidad de élite.
 * @version 15.0.0 (Validation Guardian & Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { z } from "zod";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { Step4Form } from "./Step4Form";
import type { Step4ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step4.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { validateStep4 } from "./step4.validator";

type Step4Content = z.infer<typeof Step4ContentSchema>;

interface Step4ClientProps {
  content: Step4Content;
}

export function Step4Client({ content }: Step4ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step4Client_Lifecycle_v15.0"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(
      `[Step4Client] Orquestador de cliente montado.`
    );
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const { draft, updateDraft } = useCampaignDraft();
  const wizardContext = useWizard();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleUpdateContent = useCallback(
    (sectionName: string, locale: Locale, field: string, value: unknown) => {
      logger.traceEvent(traceId, "Acción: Actualizando contenido de sección.", {
        sectionName,
        locale,
        field,
      });
      const newContentData = structuredClone(draft.contentData);
      if (!newContentData[sectionName]) newContentData[sectionName] = {};
      if (!newContentData[sectionName][locale])
        newContentData[sectionName][locale] = {};
      newContentData[sectionName][locale]![field] = value;
      updateDraft({ contentData: newContentData });
    },
    [updateDraft, draft.contentData, traceId]
  );

  const handleNext = useCallback(() => {
    const nextTraceId = logger.startTrace("Step4Client.handleNext");
    if (wizardContext) {
      try {
        // --- [INICIO] GUARDIÁN DE VALIDACIÓN ---
        const { isValid, message } = validateStep4(draft);
        if (!isValid) {
          toast.error("Contenido Incompleto", { description: message });
          logger.warn(
            `[Guardián Step4] Navegación bloqueada. Causa: ${message}`,
            { traceId: nextTraceId }
          );
          return;
        }
        logger.traceEvent(nextTraceId, "Validación de paso superada.");
        // --- [FIN] GUARDIÁN DE VALIDACIÓN ---

        logger.traceEvent(nextTraceId, "Acción: Usuario avanza al Paso 5.");
        const newCompletedSteps = Array.from(
          new Set([...draft.completedSteps, 4])
        );
        updateDraft({ completedSteps: newCompletedSteps });
        wizardContext.goToNextStep();
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "Error desconocido";
        logger.error("[Guardián] Fallo en handleNext.", {
          error: msg,
          traceId: nextTraceId,
        });
        toast.error("Error", { description: "No se pudo procesar la acción." });
      } finally {
        logger.endTrace(nextTraceId);
      }
    }
  }, [wizardContext, draft, updateDraft]);

  const handleBack = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario retrocede al Paso 3.");
      wizardContext.goToPrevStep();
    }
  }, [wizardContext, traceId]);

  if (!wizardContext)
    return (
      <DeveloperErrorDisplay
        context="Step4Client"
        errorMessage="Renderizado fuera de WizardProvider."
      />
    );
  if (!content)
    return (
      <DeveloperErrorDisplay
        context="Step4Client"
        errorMessage="Prop 'content' nula o indefinida."
      />
    );

  return (
    <Step4Form
      content={content}
      draft={draft}
      onEditSection={setEditingSection}
      onCloseEditor={() => setEditingSection(null)}
      editingSection={editingSection}
      onUpdateContent={handleUpdateContent}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
