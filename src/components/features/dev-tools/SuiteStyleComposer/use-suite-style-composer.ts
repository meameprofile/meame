// RUTA: src/components/features/dev-tools/SuiteStyleComposer/use-suite-style-composer.ts
/**
 * @file use-suite-style-composer.ts
 * @description Hook "cerebro" de élite para la lógica del Compositor de Estilos, ahora
 *              con el nombre de exportación soberano restaurado para garantizar
 *              la integridad del build.
 * @version 6.0.0 (Sovereign Export Restoration)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { deepMerge } from "@/shared/lib/utils";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { SuiteThemeConfig, LoadedFragments } from "./types";
import { logger } from "@/shared/lib/logging";
import { usePreviewStore } from "@/components/features/campaign-suite/_context/PreviewContext";

interface UseSuiteStyleComposerProps {
  initialConfig: SuiteThemeConfig;
  allThemeFragments: LoadedFragments;
}

// --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v6.0.0] ---
// Se renombra la función a 'useSuiteStyleComposer' para que coincida con la
// expectativa de importación de los componentes consumidores y el nombre del archivo.
export function useSuiteStyleComposer({
  initialConfig,
  allThemeFragments,
}: UseSuiteStyleComposerProps) {
  // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE BUILD v6.0.0] ---
  const traceId = useMemo(
    () => logger.startTrace("useSuiteStyleComposer_v6.0"),
    []
  );
  const [localSuiteConfig, setLocalSuiteConfig] =
    useState<SuiteThemeConfig>(initialConfig);
  const setPreviewTheme = usePreviewStore((state) => state.setPreviewTheme);

  useEffect(() => {
    logger.info("[useSuiteStyleComposer] Hook montado y operacional.", {
      traceId,
    });
    setLocalSuiteConfig(initialConfig);
    return () => logger.endTrace(traceId);
  }, [initialConfig, traceId]);

  const assemblePreviewTheme = useCallback(
    (config: SuiteThemeConfig): AssembledTheme | null => {
      const assembleTraceId = logger.startTrace(
        "useSuiteStyleComposer.assemble"
      );
      try {
        if (!allThemeFragments)
          throw new Error("Los fragmentos de tema no están disponibles.");

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

        const finalThemeObject: Partial<AssembledTheme> = deepMerge(
          deepMerge(baseFragment, colorFragment),
          deepMerge(fontFragment, radiusFragment)
        );

        if (granularColors)
          finalThemeObject.colors = deepMerge(
            finalThemeObject.colors || {},
            granularColors
          );
        if (granularFonts)
          finalThemeObject.fonts = deepMerge(
            finalThemeObject.fonts || {},
            granularFonts
          );
        if (granularGeometry)
          finalThemeObject.geometry = deepMerge(
            finalThemeObject.geometry || {},
            granularGeometry
          );

        const validation = AssembledThemeSchema.safeParse(finalThemeObject);
        if (!validation.success)
          throw new Error(
            `Tema ensamblado inválido: ${validation.error.message}`
          );

        logger.success(
          "[useSuiteStyleComposer] Tema de previsualización ensamblado.",
          { traceId: assembleTraceId }
        );
        return validation.data;
      } catch (error) {
        logger.error("[useSuiteStyleComposer] Fallo al ensamblar tema.", {
          error,
          traceId: assembleTraceId,
        });
        return null;
      } finally {
        logger.endTrace(assembleTraceId);
      }
    },
    [allThemeFragments]
  );

  useEffect(() => {
    const previewTheme = assemblePreviewTheme(localSuiteConfig);
    if (previewTheme) {
      setPreviewTheme(previewTheme);
    }
  }, [localSuiteConfig, assemblePreviewTheme, setPreviewTheme]);

  const handlePresetChange = useCallback(
    (key: "colorPreset" | "fontPreset" | "radiusPreset", value: string) => {
      logger.traceEvent(traceId, "Acción: Cambio de preset.", { key, value });
      setLocalSuiteConfig((prev) => ({ ...prev, [key]: value }));
    },
    [traceId]
  );

  const handleGranularChange = useCallback(
    (
      category: "granularColors" | "granularFonts" | "granularGeometry",
      cssVar: string,
      value: string
    ) => {
      logger.traceEvent(traceId, "Acción: Cambio granular.", {
        category,
        cssVar,
        value,
      });
      setLocalSuiteConfig((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [cssVar]: value,
        },
      }));
    },
    [traceId]
  );

  const clearPreview = useCallback(() => {
    logger.traceEvent(traceId, "Acción: Limpiando previsualización de tema.");
    setPreviewTheme(null);
  }, [setPreviewTheme, traceId]);

  return {
    localSuiteConfig,
    handlePresetChange,
    handleGranularChange,
    clearPreview,
  };
}
