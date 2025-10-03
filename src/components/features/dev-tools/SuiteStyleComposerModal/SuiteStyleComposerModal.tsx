// RUTA: src/components/features/dev-tools/SuiteStyleComposerModal/SuiteStyleComposerModal.tsx
/**
 * @file SuiteStyleComposerModal.tsx
 * @description Orquestador modal para la composición de temas, refactorizado
 *              a un componente de presentación puro que consume un hook de lógica.
 * @version 12.0.0 (Sovereign Path Restoration & Atomic Refactor)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { useSuiteStyleComposer } from "@/components/features/dev-tools/SuiteStyleComposer/use-suite-style-composer";
import {
  ComposerHeader,
  ComposerFooter,
  SuiteColorsTab,
  SuiteTypographyTab,
  SuiteGeometryTab,
} from "@/components/features/dev-tools/SuiteStyleComposer/_components";
import type {
  SuiteThemeConfig,
  LoadedFragments,
} from "@/components/features/dev-tools/SuiteStyleComposer/types";
import { SuiteStyleComposerContentSchema } from "@/shared/lib/schemas/components/dev/suite-style-composer.schema";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";

type ComposerContent = z.infer<typeof SuiteStyleComposerContentSchema>;

interface SuiteStyleComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allThemeFragments: LoadedFragments;
  currentSuiteConfig: SuiteThemeConfig;
  onSave: (newConfig: SuiteThemeConfig) => void;
  content: ComposerContent;
}

export function SuiteStyleComposerModal({
  isOpen,
  onClose,
  allThemeFragments,
  currentSuiteConfig,
  onSave,
  content,
}: SuiteStyleComposerModalProps) {
  logger.info(
    "[SuiteStyleComposerModal] Renderizando v12.0 (Atomic Refactor)."
  );

  // El componente ahora consume el hook "cerebro"
  const {
    localSuiteConfig,
    handlePresetChange,
    handleGranularChange,
    clearPreview,
  } = useSuiteStyleComposer({
    initialConfig: currentSuiteConfig,
    allThemeFragments,
  });

  const handleSave = () => {
    onSave(localSuiteConfig);
    onClose();
  };

  const handleCancel = () => {
    clearPreview();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col h-full"
            >
              <ComposerHeader
                title={content.composerTitle}
                description={content.composerDescription}
              />
              <div className="flex-grow overflow-y-auto">
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="mx-6">
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
                  <TabsContent value="colors">
                    <SuiteColorsTab
                      allThemeFragments={allThemeFragments}
                      selectedColorPreset={localSuiteConfig.colorPreset || ""}
                      onColorPresetChange={(value: string) =>
                        handlePresetChange("colorPreset", value)
                      }
                      content={{
                        selectThemeLabel: content.selectThemeLabel,
                        defaultPresetName: content.defaultPresetName,
                        colorFilterPlaceholder: content.colorFilterPlaceholder,
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="typography">
                    <SuiteTypographyTab
                      allThemeFragments={allThemeFragments}
                      selectedFontPreset={localSuiteConfig.fontPreset || ""}
                      granularFonts={localSuiteConfig.granularFonts || {}}
                      onFontPresetChange={(value: string) =>
                        handlePresetChange("fontPreset", value)
                      }
                      onGranularChange={handleGranularChange}
                      content={{
                        selectFontLabel: content.selectFontLabel,
                        fontFilterPlaceholder: content.fontFilterPlaceholder,
                        defaultPresetName: content.defaultPresetName,
                        fontSizeLabel: content.fontSizeLabel,
                        fontWeightLabel: content.fontWeightLabel,
                        lineHeightLabel: content.lineHeightLabel,
                        letterSpacingLabel: content.letterSpacingLabel,
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="geometry">
                    <SuiteGeometryTab
                      allThemeFragments={allThemeFragments}
                      selectedRadiusPreset={localSuiteConfig.radiusPreset || ""}
                      granularGeometry={localSuiteConfig.granularGeometry || {}}
                      onRadiusPresetChange={(value: string) =>
                        handlePresetChange("radiusPreset", value)
                      }
                      onGranularChange={handleGranularChange}
                      content={{
                        selectRadiusLabel: content.selectRadiusLabel,
                        radiusFilterPlaceholder:
                          content.radiusFilterPlaceholder,
                        defaultPresetName: content.defaultPresetName,
                        borderRadiusLabel: content.borderRadiusLabel,
                        borderWidthLabel: content.borderWidthLabel,
                        baseSpacingUnitLabel: content.baseSpacingUnitLabel,
                        inputHeightLabel: content.inputHeightLabel,
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <ComposerFooter
                onSave={handleSave}
                onCancel={handleCancel}
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
