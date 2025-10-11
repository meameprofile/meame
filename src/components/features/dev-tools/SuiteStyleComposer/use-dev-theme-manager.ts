// Ruta correcta: src/components/features/dev-tools/SuiteStyleComposer/use-dev-theme-manager.ts
/**
 * @file use-dev-theme-manager.ts
 * @description Hook "cerebro" para la gestión del tema del DCC.
 * @version 3.1.0 (Code Hygiene): Resuelve advertencias de linting
 *              al utilizar 'const' para variables no reasignadas, mejorando
 *              la calidad y previsibilidad del código.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";

import { logger } from "@/shared/lib/logging";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { deepMerge } from "@/shared/lib/utils";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";

import type { SuiteThemeConfig, LoadedFragments } from "./types";

interface UseDevThemeManagerProps {
  allThemeFragments: LoadedFragments;
}

const defaultSuiteConfig: SuiteThemeConfig = {
  colorPreset: "default-dcc",
  fontPreset: "minimalist-sans",
  radiusPreset: "rounded",
  granularColors: {},
  granularFonts: {},
  granularGeometry: {},
};

export function useDevThemeManager({
  allThemeFragments,
}: UseDevThemeManagerProps) {
  logger.info(
    "[useDevThemeManager] Inicializando hook de gestión de tema DCC (v3.1)."
  );
  const { theme: systemTheme } = useTheme();

  const [currentSuiteConfig, setCurrentSuiteConfig] =
    useState<SuiteThemeConfig>(() => {
      if (typeof window === "undefined") {
        return defaultSuiteConfig;
      }
      try {
        const savedConfigString = localStorage.getItem(
          "dcc-suite-theme-config"
        );
        if (savedConfigString) {
          const savedConfig = JSON.parse(savedConfigString);
          return deepMerge(defaultSuiteConfig, savedConfig);
        }
      } catch (e) {
        logger.error(
          "Fallo al parsear la configuración de tema guardada. Usando valores por defecto.",
          { error: e }
        );
        localStorage.removeItem("dcc-suite-theme-config");
      }
      return defaultSuiteConfig;
    });

  const applyThemeToDocument = useCallback(
    (config: SuiteThemeConfig) => {
      const {
        colorPreset,
        fontPreset,
        radiusPreset,
        granularColors,
        granularFonts,
        granularGeometry,
      } = config;

      const baseFragment = allThemeFragments.base || {};
      const colorFragment = colorPreset
        ? (allThemeFragments.colors[colorPreset] ?? {})
        : {};
      const fontFragment = fontPreset
        ? (allThemeFragments.fonts[fontPreset] ?? {})
        : {};
      const radiusFragment = radiusPreset
        ? (allThemeFragments.radii[radiusPreset] ?? {})
        : {};

      const finalTheme: Partial<AssembledTheme> = deepMerge(
        deepMerge(baseFragment, colorFragment),
        deepMerge(fontFragment, radiusFragment)
      );

      if (granularColors)
        finalTheme.colors = deepMerge(finalTheme.colors || {}, granularColors);
      if (granularFonts)
        finalTheme.fonts = deepMerge(finalTheme.fonts || {}, granularFonts);
      if (granularGeometry)
        finalTheme.geometry = deepMerge(
          finalTheme.geometry || {},
          granularGeometry
        );

      if (systemTheme === "dark" && finalTheme.colors?.dark) {
        finalTheme.colors = deepMerge(
          finalTheme.colors,
          finalTheme.colors.dark
        );
      }

      const validation = AssembledThemeSchema.safeParse(finalTheme);
      if (!validation.success) {
        logger.error("El tema final del DCC ensamblado es inválido", {
          error: validation.error,
        });
        return;
      }

      const cssVars = generateCssVariablesFromTheme(validation.data);

      let styleTag = document.getElementById(
        "dcc-theme-overrides"
      ) as HTMLStyleElement;
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dcc-theme-overrides";
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `:root { ${cssVars} }`;
    },
    [allThemeFragments, systemTheme]
  );

  useEffect(() => {
    applyThemeToDocument(currentSuiteConfig);
  }, [currentSuiteConfig, applyThemeToDocument]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "dcc-suite-theme-config",
        JSON.stringify(currentSuiteConfig)
      );
    }
  }, [currentSuiteConfig]);

  return {
    currentSuiteConfig,
    setCurrentSuiteConfig,
  };
}
