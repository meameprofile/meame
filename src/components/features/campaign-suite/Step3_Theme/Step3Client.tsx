// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3Client.tsx
/**
 * @file Step3Client.tsx
 * @description Orquestador de presentación puro para el Paso 3, nivelado a un
 *              estándar de élite con full logging, resiliencia e i18n.
 * @version 18.0.0 (Elite Compliance & Full i18n)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { useStep3Logic } from "@/shared/hooks/campaign-suite/useStep3Logic";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { Step3Form } from "./Step3Form";
import {
  ThemeComposerModal,
  CreatePresetDialog,
  DeletePresetDialog,
  EditPresetDialog,
} from "./_components";
import { DynamicIcon } from "@/components/ui";
import { DeveloperErrorDisplay } from "../../dev-tools";
import type { z } from "zod";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import { logger } from "@/shared/lib/logging";

type Step3Content = z.infer<typeof Step3ContentSchema>;

interface Step3ClientProps {
  content: Step3Content;
  loadedFragments: LoadedFragments;
}

export function Step3Client({
  content,
  loadedFragments,
}: Step3ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step3Client_Lifecycle_v18.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step3Client] Orquestador de cliente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const {
    isFetching,
    presets,
    isComposerOpen,
    setIsComposerOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    creationType,
    isSaving,
    presetToManage,
    setPresetToManage,
    handleDeletePreset,
    handleUpdatePreset,
    localConfig,
    handleConfigChange,
    handleThemeConfigSave,
    handleLaunchCreator,
    handleCreateAndSavePreset,
    onBack,
    onNext,
  } = useStep3Logic(loadedFragments);

  const { draft } = useCampaignDraft();

  if (!draft || !content || !loadedFragments) {
    const errorMsg =
      "Contrato de UI violado: Faltan props esenciales (draft, content, o loadedFragments).";
    logger.error(`[Guardián] ${errorMsg}`, {
      traceId,
      hasDraft: !!draft,
      hasContent: !!content,
    });
    return (
      <DeveloperErrorDisplay context="Step3Client" errorMessage={errorMsg} />
    );
  }

  if (isFetching || !presets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <DynamicIcon
          name="LoaderCircle"
          className="w-8 h-8 animate-spin text-primary"
        />
        <p className="mt-4 text-lg font-semibold text-foreground">
          {content.loadingTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {content.loadingDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <Step3Form
        content={content}
        themeConfig={draft.themeConfig}
        onBack={onBack}
        onNext={onNext}
        onLaunchComposer={() => setIsComposerOpen(true)}
      />
      <ThemeComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        presets={presets}
        localConfig={localConfig}
        onSave={handleThemeConfigSave}
        onLaunchCreator={handleLaunchCreator}
        onConfigChange={handleConfigChange}
        onEdit={(preset) => {
          setPresetToManage(preset);
          setIsEditModalOpen(true);
        }}
        onDelete={(preset) => setPresetToManage(preset)}
        content={content}
      />
      <CreatePresetDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAndSavePreset}
        isSaving={isSaving}
        type={creationType}
        content={content.createPresetDialog}
      />
      <EditPresetDialog
        preset={presetToManage}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setPresetToManage(null);
        }}
        onSave={handleUpdatePreset}
        isSaving={isSaving}
        content={content.editPresetDialog}
      />
      <DeletePresetDialog
        preset={presetToManage}
        isOpen={!!presetToManage && !isEditModalOpen && !isCreateModalOpen}
        onClose={() => setPresetToManage(null)}
        onConfirm={handleDeletePreset}
        isDeleting={isSaving}
        content={content.deletePresetDialog}
      />
    </>
  );
}
