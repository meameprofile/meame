// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/ThemeComposerModal.tsx
/**
 * @file ThemeComposerModal.tsx
 * @description Orquestador de Presentación Definitivo para el Compositor de Temas.
 * @version 10.0.0 (Full Preset Lifecycle UI)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import {
  ComposerHeader,
  ComposerFooter,
  PaletteSelector,
  TypographySelector,
  GeometrySelector,
} from "./";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type { CategorizedPresets } from "@/shared/hooks/campaign-suite/useStep3Logic";
import type { z } from "zod";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";

type Content = z.infer<typeof Step3ContentSchema>;

interface ThemeComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: ThemeConfig) => void;
  onLaunchCreator: (type: "color" | "font" | "geometry") => void;
  onEdit: (preset: ThemePreset) => void; // <-- Prop añadida
  onDelete: (preset: ThemePreset) => void; // <-- Prop añadida
  presets: CategorizedPresets;
  content: Content;
  localConfig: ThemeConfig;
  onConfigChange: <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K] | null
  ) => void;
}

export function ThemeComposerModal({
  isOpen,
  onClose,
  onSave,
  onLaunchCreator,
  onEdit,
  onDelete,
  presets,
  content,
  localConfig,
  onConfigChange,
}: ThemeComposerModalProps) {
  const traceId = useMemo(
    () => logger.startTrace("ThemeComposerModal_v10.0"),
    []
  );
  useEffect(() => {
    if (isOpen) {
      logger.info("[ThemeComposerModal] Orquestador de UI montado.", {
        traceId,
      });
    }
  }, [isOpen, traceId]);

  const allPresets = useMemo(() => {
    const combined = [...presets.global, ...presets.workspace];
    return combined.reduce<{
      colors: ThemePreset[];
      fonts: ThemePreset[];
      geometry: ThemePreset[];
    }>(
      (acc, preset) => {
        if (preset.type === "color") acc.colors.push(preset);
        if (preset.type === "font") acc.fonts.push(preset);
        if (preset.type === "geometry") acc.geometry.push(preset);
        return acc;
      },
      { colors: [], fonts: [], geometry: [] }
    );
  }, [presets]);

  const handleInternalSave = () => {
    onSave(localConfig);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <motion.div /* ... */ className="flex flex-col h-full">
              <ComposerHeader
                title={content.composerTitle}
                description={content.composerDescription}
              />
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
                      onSelect={(value) => onConfigChange("colorPreset", value)}
                      onCreate={() => onLaunchCreator("color")}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      createNewPaletteButton={content.createNewPaletteButton}
                      onPreview={() => {}}
                    />
                  </TabsContent>
                  <TabsContent value="typography" className="mt-4">
                    <TypographySelector
                      typographies={allPresets.fonts}
                      selectedTypographyName={localConfig.fontPreset}
                      onSelect={(value) => onConfigChange("fontPreset", value)}
                      onCreate={() => onLaunchCreator("font")}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      emptyPlaceholder={content.placeholderFontsNone}
                      createNewFontSetButton={content.createNewFontSetButton}
                      onPreview={() => {}}
                    />
                  </TabsContent>
                  <TabsContent value="geometry" className="mt-4">
                    <GeometrySelector
                      geometries={allPresets.geometry}
                      selectedGeometryName={localConfig.radiusPreset}
                      onSelect={(value) =>
                        onConfigChange("radiusPreset", value)
                      }
                      onCreate={() => onLaunchCreator("geometry")}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      emptyPlaceholder={content.placeholderRadiiNone}
                      createNewRadiusStyleButton={
                        content.createNewRadiusStyleButton
                      }
                      onPreview={() => {}}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <ComposerFooter
                onSave={handleInternalSave}
                onCancel={onClose}
                isSaving={false}
                saveButtonText={content.composerSaveButton}
                cancelButtonText={content.composerCancelButton}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
