// Ruta correcta: src/components/dev/DevThemeSwitcher.tsx
/**
 * @file DevThemeSwitcher.tsx
 * @description Componente de UI para activar el Compositor de Estilos.
 *              v5.0.0 (Sovereign Path Restoration): Se corrige la ruta de
 *              importación del hook `useDevThemeManager` a su SSoT canónica,
 *              resolviendo un error crítico de build.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import { DynamicIcon, Button } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { SuiteStyleComposerModal } from "./SuiteStyleComposerModal/SuiteStyleComposerModal";
import { useDevThemeManager } from "@/components/features/dev-tools/SuiteStyleComposer/use-dev-theme-manager";
import type {
  SuiteThemeConfig,
  LoadedFragments,
} from "@/components/features/dev-tools/SuiteStyleComposer/types";

interface DevThemeSwitcherProps {
  allThemeFragments: LoadedFragments;
  content: {
    customizeButton: string;
    composerTitle: string;
    composerDescription: string;
    composerColorsTab: string;
    composerTypographyTab: string;
    composerGeometryTab: string;
    composerSaveButton: string;
    composerCancelButton: string;
    selectThemeLabel: string;
    selectFontLabel: string;
    selectRadiusLabel: string;
    defaultPresetName: string;
    colorFilterPlaceholder: string;
    fontFilterPlaceholder: string;
    radiusFilterPlaceholder: string;
    fontSizeLabel: string;
    fontWeightLabel: string;
    lineHeightLabel: string;
    letterSpacingLabel: string;
    borderRadiusLabel: string;
    borderWidthLabel: string;
    baseSpacingUnitLabel: string;
    inputHeightLabel: string;
  };
}

export function DevThemeSwitcher({
  allThemeFragments,
  content,
}: DevThemeSwitcherProps) {
  logger.info(
    "[DevThemeSwitcher] Renderizando v5.0 (Sovereign Path Restoration)"
  );

  const { currentSuiteConfig, setCurrentSuiteConfig } = useDevThemeManager({
    allThemeFragments,
  });

  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const handleSaveSuiteConfig = (newConfig: SuiteThemeConfig) => {
    setCurrentSuiteConfig(newConfig);
    setIsComposerOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsComposerOpen(true)}
      >
        <DynamicIcon name="Sparkles" className="mr-2 h-4 w-4" />
        {content.customizeButton}
      </Button>

      {isComposerOpen && (
        <SuiteStyleComposerModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          allThemeFragments={allThemeFragments}
          currentSuiteConfig={currentSuiteConfig}
          onSave={handleSaveSuiteConfig}
          content={content}
        />
      )}
    </div>
  );
}
