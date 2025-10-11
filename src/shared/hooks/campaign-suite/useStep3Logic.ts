// RUTA: src/shared/hooks/campaign-suite/useStep3Logic.ts
/**
 * @file useStep3Logic.ts
 * @description Hook "cerebro" soberano para toda la lógica del Paso 3 de la SDC.
 * @version 4.1.0 (State Unification & Hygiene Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { toast } from "sonner";

import { useWizard } from "@/components/features/campaign-suite/_context/WizardContext";
import { validateStep3 } from "@/components/features/campaign-suite/Step3_Theme/step3.validator";
import { useCampaignDraft } from "@/shared/hooks/campaign-suite/use-campaign-draft.hook";
import { useThemeComposer } from "@/shared/hooks/campaign-suite/useThemeComposer";
import {
  getThemePresetsAction,
  createThemePresetAction,
  deleteThemePresetAction,
  updateThemePresetAction,
} from "@/shared/lib/actions/theme-presets";
import { logger } from "@/shared/lib/logging";
import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";

export interface CategorizedPresets {
  global: ThemePreset[];
  workspace: ThemePreset[];
}

export function useStep3Logic(loadedFragments: LoadedFragments) {
  const traceId = useMemo(() => logger.startTrace("useStep3Logic_v4.1"), []);
  const { draft, updateDraft } = useCampaignDraft();
  const { themeConfig, completedSteps } = draft;
  const { goToNextStep, goToPrevStep } = useWizard();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const [presets, setPresets] = useState<CategorizedPresets>({
    global: [],
    workspace: [],
  });
  const [isFetching, startFetchingTransition] = useTransition();

  // --- [INICIO DE REFACTORIZACIÓN DE ESTADO] ---
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  // --- [FIN DE REFACTORIZACIÓN DE ESTADO] ---

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [creationType, setCreationType] = useState<
    "color" | "font" | "geometry"
  >("color");
  const [presetToManage, setPresetToManage] = useState<ThemePreset | null>(
    null
  );

  const {
    localConfig,
    handleConfigChange,
    resetComposer,
    assemblePreviewTheme,
  } = useThemeComposer({
    initialConfig: themeConfig,
    allThemeFragments: loadedFragments,
  });

  useEffect(() => {
    logger.info("[useStep3Logic] Hook montado y operacional.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const fetchPresets = useCallback(() => {
    if (!activeWorkspaceId) return;
    startFetchingTransition(async () => {
      const result = await getThemePresetsAction(activeWorkspaceId);
      if (result.success) setPresets(result.data);
      else
        toast.error("Error al cargar estilos", { description: result.error });
    });
  }, [activeWorkspaceId]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handleThemeConfigSave = useCallback(
    (configToSave: ThemeConfig) => {
      updateDraft({ themeConfig: configToSave });
      setIsComposerOpen(false);
    },
    [updateDraft]
  );

  const handleLaunchCreator = (type: "color" | "font" | "geometry") => {
    setCreationType(type);
    setIsCreateModalOpen(true);
  };

  const handleCreateAndSavePreset = useCallback(
    async (name: string, description: string) => {
      if (!activeWorkspaceId) return;
      const themeToSave = assemblePreviewTheme(localConfig);
      if (!themeToSave) {
        toast.error("Error Interno", {
          description: "No se pudo ensamblar el tema para guardar.",
        });
        return;
      }
      let dataToSave: Partial<AssembledTheme> = {};
      if (creationType === "color") dataToSave = { colors: themeToSave.colors };
      else if (creationType === "font")
        dataToSave = { fonts: themeToSave.fonts };
      else if (creationType === "geometry")
        dataToSave = { geometry: themeToSave.geometry };

      startSaveTransition(async () => {
        const result = await createThemePresetAction({
          workspaceId: activeWorkspaceId,
          name,
          description,
          type: creationType,
          themeConfig: dataToSave as ThemeConfig,
        });
        if (result.success) {
          toast.success(`Preset "${name}" creado con éxito.`);
          fetchPresets();
        } else {
          toast.error("Error al crear el preset", {
            description: result.error,
          });
        }
      });
    },
    [
      activeWorkspaceId,
      localConfig,
      creationType,
      assemblePreviewTheme,
      fetchPresets,
      startSaveTransition,
    ]
  );

  const handleUpdatePreset = useCallback(
    async (id: string, name: string, description: string) => {
      if (!activeWorkspaceId) return;
      startSaveTransition(async () => {
        const result = await updateThemePresetAction({
          workspaceId: activeWorkspaceId,
          id,
          name,
          description,
        });
        if (result.success) {
          toast.success(`Preset "${name}" actualizado.`);
          fetchPresets();
        } else {
          toast.error("Error al actualizar", { description: result.error });
        }
      });
    },
    [activeWorkspaceId, fetchPresets, startSaveTransition]
  );

  const handleDeletePreset = useCallback(() => {
    if (!presetToManage || !activeWorkspaceId) return;
    startDeleteTransition(async () => {
      const result = await deleteThemePresetAction({
        id: presetToManage.id,
        workspaceId: activeWorkspaceId,
      });
      if (result.success) {
        toast.success(`Preset "${presetToManage.name}" eliminado.`);
        fetchPresets();
      } else {
        toast.error("Error al eliminar", { description: result.error });
      }
      setPresetToManage(null);
    });
  }, [presetToManage, activeWorkspaceId, fetchPresets]);

  const handleNext = useCallback(() => {
    const { isValid, message } = validateStep3(draft);
    if (!isValid) {
      toast.error("Paso Incompleto", { description: message });
      return;
    }
    const newCompletedSteps = Array.from(new Set([...completedSteps, 3]));
    updateDraft({ completedSteps: newCompletedSteps });
    goToNextStep();
  }, [draft, completedSteps, updateDraft, goToNextStep]);

  return {
    isFetching,
    presets,
    isComposerOpen,
    setIsComposerOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    creationType,
    isSaving: isSaving || isDeleting, // Estado unificado de "trabajando"
    presetToManage,
    setPresetToManage,
    handleDeletePreset,
    handleUpdatePreset,
    localConfig,
    handleConfigChange,
    resetComposer,
    handleThemeConfigSave,
    handleLaunchCreator,
    handleCreateAndSavePreset,
    onBack: goToPrevStep,
    onNext: handleNext,
  };
}
