// RUTA: src/components/features/campaign-suite/Step5_Management/Step5Client.tsx
/**
 * @file Step5Client.tsx
 * @description Orquestador de cliente para el Paso 5, nivelado para recibir
 *              Server Actions como props y restaurar la integridad arquitectónica.
 * @version 14.0.0 (Dependency Inversion & Architectural Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import type { z } from "zod";

import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { DigitalConfetti } from "@/components/ui/DigitalConfetti";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { useCampaignLifecycle } from "@/shared/hooks/campaign-suite/use-campaign-lifecycle";
import { useCampaignTemplates } from "@/shared/hooks/campaign-suite/use-campaign-templates";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";
import { useCelebrationStore } from "@/shared/lib/stores/use-celebration.store";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { validateDraftForLaunch } from "@/shared/lib/utils/campaign-suite/draft.validator";

import { DeveloperErrorDisplay } from "../../dev-tools";

import { ArtifactHistory } from "./_components/ArtifactHistory";
import { Step5Form } from "./Step5Form";

type Content = z.infer<typeof Step5ContentSchema>;

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v14.0.0] ---
// Se define un contrato explícito para las acciones que el componente recibirá como props.
interface Step5Actions {
  publish: (
    draft: CampaignDraft
  ) => Promise<ActionResult<{ message: string; variantId: string }>>;
  package: (
    draft: CampaignDraft
  ) => Promise<ActionResult<{ downloadUrl: string }>>;
  delete: (draftId: string) => Promise<ActionResult<{ deletedCount: number }>>;
}

interface Step5ClientProps {
  locale: Locale;
  stepContent: Content;
  actions: Step5Actions;
}
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v14.0.0] ---

export function Step5Client({
  locale,
  stepContent,
  actions, // Las acciones ahora se reciben como props.
}: Step5ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step5Client_Lifecycle_v14.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step5Client] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { draft: assembledDraft } = useCampaignDraft();
  const { isCelebrating, endCelebration } = useCelebrationStore();
  const { goToPrevStep } = useWizard();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  // El hook de ciclo de vida ahora recibe las acciones pasadas desde el servidor.
  const {
    onPublish,
    onPackage,
    onDelete,
    isPublishing,
    isPackaging,
    isDeleting,
  } = useCampaignLifecycle(locale, actions);

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

  // Callbacks para los eventos de UI. Siguen siendo los mismos.
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

  // Guardianes de Resiliencia
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
