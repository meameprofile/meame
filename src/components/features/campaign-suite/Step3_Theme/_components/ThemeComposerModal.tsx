// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/ThemeComposerModal.tsx
/**
 * @file ThemeComposerModal.tsx
 * @description Orquestador modal para la Bóveda de Estilos. Forjado con
 *              observabilidad granular, un guardián de resiliencia holístico y
 *              un flujo de datos soberano y puro.
 * @version 7.1.1 (React Hooks Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { PaletteSelector, TypographySelector, GeometrySelector } from "./";
import { usePreviewStore } from "@/components/features/campaign-suite/_context/PreviewContext";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { deepMerge } from "@/shared/lib/utils";
import { logger } from "@/shared/lib/logging";
import type { CategorizedPresets } from "../Step3Client";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { z } from "zod";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";

type Content = z.infer<typeof Step3ContentSchema>;

interface ThemeComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: CategorizedPresets;
  currentConfig: ThemeConfig;
  onSave: (newConfig: ThemeConfig) => void;
  onCreatePreset: (
    name: string,
    description: string,
    type: "color" | "font" | "geometry",
    config: ThemeConfig
  ) => Promise<void>;
  content: Content;
  loadedFragments: LoadedFragments;
}

export function ThemeComposerModal({
  isOpen,
  onClose,
  presets,
  currentConfig,
  onSave,
  onCreatePreset,
  content,
  loadedFragments,
}: ThemeComposerModalProps) {
  // --- [INICIO DE CORRECCIÓN DE REGLAS DE HOOKS] ---
  // Se elimina la dependencia 'isOpen' del useMemo. El traceId debe ser
  // constante durante todo el ciclo de vida del componente para una
  // trazabilidad coherente.
  const traceId = useMemo(
    () => logger.startTrace("ThemeComposerModal_Lifecycle_v7.1.1"),
    [] // El array de dependencias vacío asegura que esto se ejecute solo una vez.
  );
  // --- [FIN DE CORRECCIÓN DE REGLAS DE HOOKS] ---

  useEffect(() => {
    if (isOpen) logger.info("[ThemeComposerModal] Modal montado.", { traceId });
    return () => {
      // El endTrace se ejecuta cuando el componente se desmonta o el efecto se vuelve a ejecutar.
      // Si el modal está abierto durante el desmontaje, se registra el final del trace.
      if (isOpen) logger.endTrace(traceId);
    };
  }, [isOpen, traceId]);

  const [localConfig, setLocalConfig] = useState(currentConfig);
  const { setPreviewTheme } = usePreviewStore();

  const allPresets = useMemo(() => {
    const combined = [...presets.global, ...presets.workspace];
    return combined.reduce(
      (acc, preset) => {
        if (preset.type === "color") acc.colors.push(preset);
        if (preset.type === "font") acc.fonts.push(preset);
        if (preset.type === "geometry") acc.geometry.push(preset);
        return acc;
      },
      {
        colors: [] as ThemePreset[],
        fonts: [] as ThemePreset[],
        geometry: [] as ThemePreset[],
      }
    );
  }, [presets]);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(currentConfig);
      logger.traceEvent(traceId, "Modal abierto, estado local sincronizado.");
    } else {
      setPreviewTheme(null);
    }
  }, [currentConfig, isOpen, setPreviewTheme, traceId]);

  const assemblePreviewTheme = useCallback(
    (config: ThemeConfig): AssembledTheme | null => {
      try {
        const findPresetData = (
          type: "colors" | "fonts" | "radii",
          name: string | null
        ): Partial<AssembledTheme> => {
          if (!name) return {};
          const presetSource =
            type === "colors"
              ? allPresets.colors
              : type === "fonts"
                ? allPresets.fonts
                : allPresets.geometry;
          const preset = presetSource.find((p) => p.name === name);
          return preset?.theme_config
            ? (preset.theme_config as Partial<AssembledTheme>)
            : {};
        };

        const finalTheme = deepMerge(
          deepMerge(
            deepMerge(
              loadedFragments.base || {},
              findPresetData("colors", config.colorPreset)
            ),
            findPresetData("fonts", config.fontPreset)
          ),
          findPresetData("radii", config.radiusPreset)
        );

        return AssembledThemeSchema.parse(finalTheme);
      } catch (error) {
        logger.error("[ThemeComposerModal] Fallo al ensamblar el tema.", {
          error,
          config,
          traceId,
        });
        return null;
      }
    },
    [allPresets, loadedFragments, traceId]
  );

  const handlePreviewUpdate = useCallback(
    (newConfig: Partial<ThemeConfig>) => {
      const tempConfig = { ...localConfig, ...newConfig };
      const previewTheme = assemblePreviewTheme(tempConfig);
      if (previewTheme) setPreviewTheme(previewTheme);
    },
    [localConfig, assemblePreviewTheme, setPreviewTheme]
  );

  const handleSelect = useCallback(
    (
      key: keyof Pick<
        ThemeConfig,
        "colorPreset" | "fontPreset" | "radiusPreset"
      >,
      value: string
    ) => {
      logger.traceEvent(traceId, `Acción: Selección de preset.`, {
        key,
        value,
      });
      const newConfig = { ...localConfig, [key]: value };
      setLocalConfig(newConfig);
      handlePreviewUpdate(newConfig);
    },
    [localConfig, handlePreviewUpdate, traceId]
  );

  const handleSave = useCallback(() => {
    logger.traceEvent(traceId, "Acción: Guardar y cerrar modal.");
    setPreviewTheme(null);
    onSave(localConfig);
    onClose();
  }, [localConfig, onSave, onClose, setPreviewTheme, traceId]);

  const handleCancel = useCallback(() => {
    logger.traceEvent(traceId, "Acción: Cancelar y cerrar modal.");
    setPreviewTheme(null);
    onClose();
  }, [onClose, setPreviewTheme, traceId]);

  const handleCreate = useCallback(
    (type: "color" | "font" | "geometry") => {
      logger.traceEvent(traceId, "Acción: Iniciar creación de nuevo preset.", {
        type,
      });
      // Aquí se llamaría a onCreatePreset, posiblemente abriendo otro modal para pedir nombre/descripción.
      // Por ahora, para cumplir el contrato, lo llamamos con valores placeholder.
      onCreatePreset(
        `Nuevo Preset de ${type}`,
        `Descripción para el nuevo preset`,
        type,
        localConfig
      );
      toast.info(
        `Funcionalidad para crear presets de tipo '${type}' en desarrollo.`
      );
    },
    [traceId, onCreatePreset, localConfig]
  );

  if (!content) {
    return (
      <DeveloperErrorDisplay
        context="ThemeComposerModal"
        errorMessage="La prop 'content' es requerida."
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col h-full"
            >
              <DialogHeader className="p-6 border-b">
                <DialogTitle>{content.composerTitle}</DialogTitle>
                <DialogDescription>
                  {content.composerDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto px-6">
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList>
                    <TabsTrigger value="colors">
                      {content.composerColorsTab}
                    </TabsTrigger>
                    <TabsTrigger value="typography">
                      {content.composerTypographyTab}
                    </TabsTrigger>
                    <TabsTrigger value="geometry">
                      {content.composerGeometryTab}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="colors" className="mt-4">
                    <PaletteSelector
                      palettes={allPresets.colors}
                      selectedPaletteName={localConfig.colorPreset}
                      onSelect={(value) => handleSelect("colorPreset", value)}
                      onPreview={(palette) =>
                        handlePreviewUpdate({
                          colorPreset: palette?.name || localConfig.colorPreset,
                        })
                      }
                      onCreate={() => handleCreate("color")}
                      createNewPaletteButton={content.createNewPaletteButton}
                    />
                  </TabsContent>
                  <TabsContent value="typography" className="mt-4">
                    <TypographySelector
                      typographies={allPresets.fonts}
                      selectedTypographyName={localConfig.fontPreset}
                      onSelect={(value) => handleSelect("fontPreset", value)}
                      onPreview={(font) =>
                        handlePreviewUpdate({
                          fontPreset: font?.name || localConfig.fontPreset,
                        })
                      }
                      onCreate={() => handleCreate("font")}
                      emptyPlaceholder={content.placeholderFontsNone}
                      createNewFontSetButton={content.createNewFontSetButton}
                    />
                  </TabsContent>
                  <TabsContent value="geometry" className="mt-4">
                    <GeometrySelector
                      geometries={allPresets.geometry}
                      selectedGeometryName={localConfig.radiusPreset}
                      onSelect={(value) => handleSelect("radiusPreset", value)}
                      onPreview={(geo) =>
                        handlePreviewUpdate({
                          radiusPreset: geo?.name || localConfig.radiusPreset,
                        })
                      }
                      onCreate={() => handleCreate("geometry")}
                      emptyPlaceholder={content.placeholderRadiiNone}
                      createNewRadiusStyleButton={
                        content.createNewRadiusStyleButton
                      }
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter className="p-6 border-t mt-auto">
                <Button variant="outline" onClick={handleCancel}>
                  {content.composerCancelButton}
                </Button>
                <Button onClick={handleSave}>
                  {content.composerSaveButton}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
