// RUTA: src/shared/hooks/campaign-suite/use-preview-theme.ts
/**
 * @file use-preview-theme.ts
 * @description Hook atómico para ensamblar el tema de la vista previa.
 *              v7.0.0 (Data Flow Restoration & Logic Fix): Se restaura el flujo de
 *              datos correcto y se corrige la lógica de `useMemo`.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useMemo } from "react";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { usePreviewStore } from "@/components/features/campaign-suite/_context/PreviewContext";
import { deepMerge } from "@/shared/lib/utils";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { LoadedFragments } from "@/shared/lib/actions/campaign-suite";

interface UsePreviewThemeReturn {
  theme: AssembledTheme | null;
  error: string | null;
}

export function usePreviewTheme(
  allThemeFragments: LoadedFragments | null
): UsePreviewThemeReturn {
  const themeConfig = useStep3ThemeStore((state) => state.themeConfig);
  const previewThemeFromStore = usePreviewStore((state) => state.previewTheme);

  const theme = useMemo(() => {
    if (previewThemeFromStore) {
      return previewThemeFromStore;
    }

    if (!allThemeFragments) return null;

    const { colorPreset, fontPreset, radiusPreset, themeOverrides } =
      themeConfig;
    if (!colorPreset || !fontPreset || !radiusPreset) return null;

    try {
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
        console.error("Tema ensamblado inválido", validation.error.flatten());
        return null;
      }
      return validation.data;
    } catch (error) {
      console.error("Error al ensamblar el tema de previsualización", error);
      return null;
    }
  }, [previewThemeFromStore, themeConfig, allThemeFragments]);

  return { theme, error: null };
}
// RUTA: src/shared/hooks/campaign-suite/use-preview-theme.tsx
