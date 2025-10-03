// RUTA: src/components/features/campaign-suite/Step5_Management/Step5Client.tsx
/**
 * @file Step5Client.tsx
 * @description Orquestador de cliente para el Paso 5, con observabilidad holística
 *              y cumplimiento de los 8 Pilares de Calidad.
 * @version 11.0.0 (Holistic Observability & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { z } from "zod";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useCampaignLifecycle } from "@/shared/hooks/campaign-suite/use-campaign-lifecycle";
import { useCampaignTemplates } from "@/shared/hooks/campaign-suite/use-campaign-templates";
import { useCelebrationStore } from "@/shared/lib/stores/use-celebration.store";
import { validateDraftForLaunch } from "@/shared/lib/utils/campaign-suite/draft.validator";
import { Step5Form } from "./Step5Form";
import { DigitalConfetti } from "@/components/ui/DigitalConfetti";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "../../dev-tools";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import { ArtifactHistory } from "./_components/ArtifactHistory";
import { useAssembledDraft } from "@/shared/hooks/campaign-suite/use-assembled-draft.hook";

type Content = z.infer<typeof Step5ContentSchema>;

interface Step5ClientProps {
  locale: Locale;
  stepContent: Content;
}

export function Step5Client({
  locale,
  stepContent,
}: Step5ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step5Client_Lifecycle_v11.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step5Client] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const assembledDraft = useAssembledDraft();
  const { isCelebrating, endCelebration } = useCelebrationStore();
  const { goToPrevStep } = useWizard();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const {
    onPublish,
    onPackage,
    onDelete,
    isPublishing,
    isPackaging,
    isDeleting,
  } = useCampaignLifecycle(locale, assembledDraft);
  const { onSaveAsTemplate, isSavingTemplate } =
    useCampaignTemplates(assembledDraft);

  const checklistItems = useMemo(() => {
    logger.traceEvent(traceId, "Calculando checklist de pre-lanzamiento...");
    return validateDraftForLaunch(assembledDraft);
  }, [assembledDraft, traceId]);

  const isLaunchReady = useMemo(
    () => checklistItems.every((item) => item.isCompleted),
    [checklistItems]
  );

  const handlePublish = useCallback(() => {
    logger.traceEvent(traceId, "Acción de usuario: Iniciar Publicación.");
    onPublish();
  }, [onPublish, traceId]);

  const handlePackage = useCallback(() => {
    logger.traceEvent(traceId, "Acción de usuario: Iniciar Empaquetado.");
    onPackage();
  }, [onPackage, traceId]);

  const handleDelete = useCallback(() => {
    logger.warn(
      "[Step5Client] Acción de usuario: Iniciar Eliminación de Borrador.",
      { traceId }
    );
    onDelete();
  }, [onDelete, traceId]);

  const handleSaveTemplate = useCallback(
    (name: string, description: string) => {
      logger.traceEvent(traceId, "Acción de usuario: Guardar como Plantilla.", {
        name,
      });
      onSaveAsTemplate(name, description);
    },
    [onSaveAsTemplate, traceId]
  );

  if (!stepContent) {
    return (
      <DeveloperErrorDisplay
        context="Step5Client"
        errorMessage="Contenido i18n no proporcionado."
      />
    );
  }
  if (!assembledDraft.draftId || !activeWorkspaceId) {
    return (
      <DeveloperErrorDisplay
        context="Step5Client"
        errorMessage="Faltan datos críticos (draftId o workspaceId)."
      />
    );
  }

  return (
    <>
      <Step5Form
        draft={assembledDraft}
        checklistItems={checklistItems}
        content={stepContent}
        onBack={goToPrevStep}
        onPublish={handlePublish}
        onPackage={handlePackage}
        onConfirmDelete={handleDelete}
        onSaveAsTemplate={handleSaveTemplate}
        isPublishing={isPublishing}
        isPackaging={isPackaging}
        isDeleting={isDeleting}
        isSavingTemplate={isSavingTemplate}
        isLaunchReady={isLaunchReady}
        artifactHistorySlot={
          <ArtifactHistory
            draftId={assembledDraft.draftId}
            content={stepContent.artifactHistory}
          />
        }
      />
      <DigitalConfetti isActive={isCelebrating} onComplete={endCelebration} />
    </>
  );
}
