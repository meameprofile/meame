// RUTA: src/shared/hooks/campaign-suite/useThemeComposer.ts
/**
 * @file useThemeComposer.ts
 * @description Hook "cerebro" de élite para la lógica del Compositor de Estilos de la SDC.
 * @version 1.1.0 (Type Contract Fix)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePreviewStore } from "@/components/features/campaign-suite/_context/PreviewContext";
import { deepMerge } from "@/shared/lib/utils";
import {
  AssembledThemeSchema,
  type AssembledTheme,
} from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";

interface UseThemeComposerProps {
  initialConfig: ThemeConfig;
  allThemeFragments: LoadedFragments;
}

export function useThemeComposer({
  initialConfig,
  allThemeFragments,
}: UseThemeComposerProps) {
  const traceId = useMemo(() => logger.startTrace("useThemeComposer_v1.1"), []);
  const [localConfig, setLocalConfig] = useState<ThemeConfig>(initialConfig);
  const setPreviewTheme = usePreviewStore((state) => state.setPreviewTheme);

  useEffect(() => {
    logger.info("[useThemeComposer] Hook montado y operacional.", { traceId });
    setLocalConfig(initialConfig);
    return () => {
      setPreviewTheme(null);
      logger.endTrace(traceId);
    };
  }, [initialConfig, setPreviewTheme, traceId]);

  const assemblePreviewTheme = useCallback(
    (config: ThemeConfig): AssembledTheme | null => {
      // ... (lógica interna sin cambios)
      const assembleTraceId = logger.startTrace("useThemeComposer.assemble");
      try {
        if (!allThemeFragments)
          throw new Error("Los fragmentos de tema no están disponibles.");

        const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
          config;

        const finalThemeObject = deepMerge(
          deepMerge(
            deepMerge(
              deepMerge(
                allThemeFragments.base,
                allThemeFragments.colors[colorPreset || ""] || {}
              ),
              allThemeFragments.fonts[fontPreset || ""] || {}
            ),
            allThemeFragments.radii[radiusPreset || ""] || {}
          ),
          themeOverrides ?? {}
        );

        const validation = AssembledThemeSchema.safeParse(finalThemeObject);
        if (!validation.success) {
          throw new Error(
            `Tema ensamblado para previsualización es inválido: ${validation.error.message}`
          );
        }

        logger.success(
          "[useThemeComposer] Tema de previsualización ensamblado y validado.",
          { traceId: assembleTraceId }
        );
        return validation.data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido.";
        logger.error(
          "[useThemeComposer] Fallo al ensamblar el tema de previsualización.",
          { error: errorMessage, traceId: assembleTraceId }
        );
        return null;
      } finally {
        logger.endTrace(assembleTraceId);
      }
    },
    [allThemeFragments]
  );

  useEffect(() => {
    const previewTheme = assemblePreviewTheme(localConfig);
    setPreviewTheme(previewTheme);
  }, [localConfig, assemblePreviewTheme, setPreviewTheme]);

  // --- [INICIO DE CORRECCIÓN DE CONTRATO DE TIPO] ---
  const handleConfigChange = useCallback(
    <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K] | null) => {
      logger.traceEvent(
        traceId,
        "Acción: Cambio de configuración local del compositor.",
        { key, value }
      );
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
    },
    [traceId]
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO DE TIPO] ---

  const resetComposer = useCallback(() => {
    logger.traceEvent(
      traceId,
      "Acción: Revirtiendo configuración local a la inicial."
    );
    setLocalConfig(initialConfig);
    setPreviewTheme(null);
  }, [initialConfig, setPreviewTheme, traceId]);

  return {
    localConfig,
    handleConfigChange,
    resetComposer,
    assemblePreviewTheme,
  };
}
