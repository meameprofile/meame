// RUTA: src/components/features/dev-tools/SuiteStyleComposer/use-suite-style-composer.ts
/**
 * @file use-suite-style-composer.ts
 * @description Hook "cerebro" de élite para la lógica del Compositor de Estilos.
 * @version 4.0.0 (Atomic API & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { deepMerge } from "@/shared/lib/utils";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";
import type { SuiteThemeConfig, LoadedFragments } from "./types";
import { logger } from "@/shared/lib/logging";

const PREVIEW_STYLE_TAG_ID = "dcc-preview-theme-overrides";

interface UseSuiteStyleComposerProps {
  initialConfig: SuiteThemeConfig;
  allThemeFragments: LoadedFragments;
}

export function useSuiteStyleComposer({
  initialConfig,
  allThemeFragments,
}: UseSuiteStyleComposerProps) {
  logger.trace("[useSuiteStyleComposer] Inicializando hook v4.0 (Atomic API).");
  const [localSuiteConfig, setLocalSuiteConfig] =
    useState<SuiteThemeConfig>(initialConfig);

  const applyPreview = useCallback(
    (config: SuiteThemeConfig) => {
      const {
        colorPreset,
        fontPreset,
        radiusPreset,
        granularFonts,
        granularGeometry,
      } = config;
      const finalTheme = deepMerge(
        deepMerge(
          deepMerge(
            allThemeFragments.base,
            allThemeFragments.colors[colorPreset || ""] || {}
          ),
          allThemeFragments.fonts[fontPreset || ""] || {}
        ),
        allThemeFragments.radii[radiusPreset || ""] || {}
      );

      if (granularFonts)
        finalTheme.fonts = deepMerge(finalTheme.fonts || {}, granularFonts);
      if (granularGeometry)
        finalTheme.geometry = deepMerge(
          finalTheme.geometry || {},
          granularGeometry
        );

      const validation = AssembledThemeSchema.safeParse(finalTheme);
      if (!validation.success) return;

      const cssVars = generateCssVariablesFromTheme(validation.data);
      let styleTag = document.getElementById(PREVIEW_STYLE_TAG_ID);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = PREVIEW_STYLE_TAG_ID;
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `:root { ${cssVars} }`;
    },
    [allThemeFragments]
  );

  const clearPreview = useCallback(() => {
    const styleTag = document.getElementById(PREVIEW_STYLE_TAG_ID);
    if (styleTag) styleTag.remove();
  }, []);

  useEffect(() => {
    applyPreview(localSuiteConfig);
  }, [localSuiteConfig, applyPreview]);

  useEffect(() => {
    return () => clearPreview();
  }, [clearPreview]);

  const handlePresetChange = useCallback(
    (
      presetType: "colorPreset" | "fontPreset" | "radiusPreset",
      value: string
    ) => {
      setLocalSuiteConfig((prev) => ({ ...prev, [presetType]: value }));
    },
    []
  );

  const handleGranularChange = useCallback(
    (
      category: "granularFonts" | "granularGeometry",
      cssVar: string,
      value: string
    ) => {
      setLocalSuiteConfig((prev) => {
        const newGranularState = { ...(prev[category] || {}), [cssVar]: value };
        return { ...prev, [category]: newGranularState };
      });
    },
    []
  );

  return {
    localSuiteConfig,
    handlePresetChange,
    handleGranularChange,
    clearPreview,
  };
}
