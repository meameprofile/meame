// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3Client.tsx
/**
 * @file Step3Client.tsx
 * @description Orquestador de cliente para el Paso 3, nivelado con un guardián
 *              de validación proactivo y observabilidad de élite.
 * @version 14.0.0 (Validation Guardian & Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import {
  getThemePresetsAction,
  createThemePresetAction,
} from "@/shared/lib/actions/theme-presets";
import { Step3Form } from "./Step3Form";
import { ThemeComposerModal } from "./_components/ThemeComposerModal";
import { DynamicIcon } from "@/components/ui";
import type { z } from "zod";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { validateStep3 } from "./step3.validator";

type Step3Content = z.infer<typeof Step3ContentSchema>;

export type CategorizedPresets = {
  global: ThemePreset[];
  workspace: ThemePreset[];
};

interface Step3ClientProps {
  content: Step3Content;
  loadedFragments: LoadedFragments;
}

export function Step3Client({
  content,
  loadedFragments,
}: Step3ClientProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("Step3Client_Lifecycle_v14.0"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(
      `[Step3Client] Orquestador de cliente montado.`
    );
    logger.info("Estado inicial del borrador consumido.", { traceId });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const { draft, updateDraft } = useCampaignDraft();
  const { themeConfig, completedSteps } = draft;

  const wizardContext = useWizard();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [presets, setPresets] = useState<CategorizedPresets | null>(null);
  const [isFetching, startFetchingTransition] = useTransition();

  const fetchPresets = useCallback(() => {
    if (!activeWorkspaceId) return;
    startFetchingTransition(async () => {
      const fetchTraceId = logger.startTrace("Step3Client.fetchPresets");
      const result = await getThemePresetsAction(activeWorkspaceId);
      if (result.success) {
        setPresets(result.data);
        logger.success(
          `[Step3Client] Se cargaron ${result.data.global.length + result.data.workspace.length} presets.`,
          { traceId: fetchTraceId }
        );
      } else {
        toast.error("Error al cargar los estilos del workspace.", {
          description: result.error,
        });
        logger.error("[Step3Client] Fallo al cargar presets.", {
          error: result.error,
          traceId: fetchTraceId,
        });
      }
      logger.endTrace(fetchTraceId);
    });
  }, [activeWorkspaceId]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handleThemeConfigSave = useCallback(
    (newConfig: ThemeConfig) => {
      logger.traceEvent(
        traceId,
        "Acción: Guardando configuración de tema desde el compositor."
      );
      updateDraft({ themeConfig: newConfig });
    },
    [updateDraft, traceId]
  );

  const handleCreatePreset = useCallback(
    async (
      name: string,
      description: string,
      type: "color" | "font" | "geometry",
      config: ThemeConfig
    ) => {
      if (!activeWorkspaceId) return;
      const result = await createThemePresetAction({
        workspaceId: activeWorkspaceId,
        name,
        description,
        type,
        themeConfig: config,
      });
      if (result.success) {
        toast.success(`Preset "${name}" creado con éxito.`);
        fetchPresets();
      } else {
        toast.error("Error al crear el preset", { description: result.error });
      }
    },
    [activeWorkspaceId, fetchPresets]
  );

  const handleNext = useCallback(() => {
    const nextTraceId = logger.startTrace("Step3Client.handleNext");
    if (wizardContext) {
      try {
        // --- [INICIO] GUARDIÁN DE VALIDACIÓN ---
        const { isValid, message } = validateStep3(draft);
        if (!isValid) {
          toast.error("Paso Incompleto", { description: message });
          logger.warn(
            `[Guardián Step3] Navegación bloqueada. Causa: ${message}`,
            { traceId: nextTraceId }
          );
          return;
        }
        logger.traceEvent(nextTraceId, "Validación de paso superada.");
        // --- [FIN] GUARDIÁN DE VALIDACIÓN ---

        logger.traceEvent(nextTraceId, "Acción: Usuario avanza al Paso 4.");
        const newCompletedSteps = Array.from(new Set([...completedSteps, 3]));
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
  }, [wizardContext, completedSteps, updateDraft, draft]);

  if (!wizardContext) {
    return (
      <DeveloperErrorDisplay
        context="Step3Client"
        errorMessage="Renderizado fuera de WizardProvider."
      />
    );
  }
  const { goToPrevStep } = wizardContext;

  if (isFetching || !presets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <DynamicIcon
          name="LoaderCircle"
          className="w-8 h-8 animate-spin text-primary"
        />
        <p className="mt-4 text-lg font-semibold text-foreground">
          Cargando Bóveda de Estilos...
        </p>
        <p className="text-sm text-muted-foreground">
          Sincronizando con la base de datos.
        </p>
      </div>
    );
  }

  return (
    <>
      <Step3Form
        content={content}
        themeConfig={themeConfig}
        onBack={goToPrevStep}
        onNext={handleNext}
        onLaunchComposer={() => setIsComposerOpen(true)}
      />
      <ThemeComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        presets={presets}
        currentConfig={themeConfig}
        onSave={handleThemeConfigSave}
        onCreatePreset={handleCreatePreset}
        content={content}
        loadedFragments={loadedFragments}
      />
    </>
  );
}
