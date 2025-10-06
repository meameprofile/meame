// RUTA: src/shared/hooks/campaign-suite/use-preview-theme.ts
/**
 * @file use-preview-theme.ts
 * @description Hook atómico para ensamblar el tema de la vista previa.
 * @version 8.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { useMemo } from "react";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { usePreviewStore } from "@/components/features/campaign-suite/_context/PreviewContext";
import { deepMerge } from "@/shared/lib/utils";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";
import { logger } from "@/shared/lib/logging";

interface UsePreviewThemeReturn {
  theme: AssembledTheme | null;
  error: string | null;
}

export function usePreviewTheme(
  allThemeFragments: LoadedFragments | null
): UsePreviewThemeReturn {
  const themeConfig = useStep3ThemeStore((state) => state.themeConfig);
  const previewThemeFromStore = usePreviewStore((state) => state.previewTheme);

  const { theme, error } = useMemo(() => {
    const traceId = logger.startTrace("usePreviewTheme.assemble_v8.0");
    try {
      if (previewThemeFromStore) {
        logger.traceEvent(
          traceId,
          "Usando tema de previsualización temporal del store."
        );
        return { theme: previewThemeFromStore, error: null };
      }

      if (!allThemeFragments)
        throw new Error("Los fragmentos de tema no están cargados.");

      const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
        themeConfig;
      if (!colorPreset || !fontPreset || !radiusPreset) {
        logger.traceEvent(
          traceId,
          "Configuración de tema incompleta, no se ensambla."
        );
        return { theme: null, error: null };
      }

      const finalThemeObject = deepMerge(
        deepMerge(
          deepMerge(
            deepMerge(
              allThemeFragments.base,
              allThemeFragments.colors[colorPreset] || {}
            ),
            allThemeFragments.fonts[fontPreset] || {}
          ),
          allThemeFragments.radii[radiusPreset] || {}
        ),
        themeOverrides ?? {}
      );

      const validation = AssembledThemeSchema.safeParse(finalThemeObject);
      if (!validation.success) {
        throw new Error(
          `Tema ensamblado inválido: ${validation.error.message}`
        );
      }

      logger.traceEvent(traceId, "Tema ensamblado y validado con éxito.");
      return { theme: validation.data, error: null };
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Error desconocido.";
      logger.error("[usePreviewTheme] Fallo al ensamblar el tema.", {
        error: errorMessage,
        traceId,
      });
      return { theme: null, error: errorMessage };
    } finally {
      logger.endTrace(traceId);
    }
  }, [previewThemeFromStore, themeConfig, allThemeFragments]);

  return { theme, error };
}
