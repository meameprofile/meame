// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3Client.tsx
/**
 * @file Step3Client.tsx
 * @description Contenedor de Cliente para el Paso 3, inyectado con observabilidad de
 *              ciclo de vida completo y un sistema de caché de presets.
 * @version 12.0.0 (Elite Observability & State Management)
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
import { useStep3ThemeStore } from "@/shared/hooks/campaign-suite/use-step3-theme.store";
import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
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
import { DeveloperErrorDisplay } from "../../dev-tools";

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
    () => logger.startTrace("Step3Client_Lifecycle_v12.0"),
    []
  );
  useEffect(() => {
    logger.info("[Step3Client] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { themeConfig, updateThemeConfig } = useStep3ThemeStore();
  const { completeStep } = useDraftMetadataStore();
  const wizardContext = useWizard();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [presets, setPresets] = useState<CategorizedPresets | null>(null);
  const [isFetching, startFetchingTransition] = useTransition();

  const fetchPresets = useCallback(() => {
    if (!activeWorkspaceId) return;
    startFetchingTransition(async () => {
      logger.traceEvent(traceId, "Iniciando fetch de presets de tema...");
      const result = await getThemePresetsAction(activeWorkspaceId);
      if (result.success) {
        setPresets(result.data);
        logger.success(
          `[Step3Client] Se cargaron ${result.data.global.length + result.data.workspace.length} presets.`,
          { traceId }
        );
      } else {
        toast.error("Error al cargar los estilos del workspace.", {
          description: result.error,
        });
        logger.error("[Step3Client] Fallo al cargar presets.", {
          error: result.error,
          traceId,
        });
      }
    });
  }, [activeWorkspaceId, traceId]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handleCreatePreset = useCallback(
    async (
      name: string,
      description: string,
      type: "color" | "font" | "geometry",
      config: ThemeConfig
    ) => {
      if (!activeWorkspaceId) return;
      logger.traceEvent(traceId, "Acción: Creando nuevo preset de tema.", {
        name,
        type,
      });
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
    [activeWorkspaceId, fetchPresets, traceId]
  );

  const handleNext = useCallback(() => {
    if (wizardContext) {
      logger.traceEvent(traceId, "Acción: Usuario avanza al Paso 4.");
      completeStep(3);
      wizardContext.goToNextStep();
    }
  }, [completeStep, wizardContext, traceId]);

  if (!wizardContext) {
    const errorMsg =
      "Guardián de Contexto: Renderizado fuera de WizardProvider.";
    logger.error(`[Step3Client] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="Step3Client" errorMessage={errorMsg} />
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
        onSave={updateThemeConfig}
        onCreatePreset={handleCreatePreset}
        content={content}
        loadedFragments={loadedFragments}
      />
    </>
  );
}
