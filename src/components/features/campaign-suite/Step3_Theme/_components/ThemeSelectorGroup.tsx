// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/ThemeSelectorGroup.tsx
/**
 * @file ThemeSelectorGroup.tsx
 * @description Aparato de UI que agrupa los selectores de fragmentos de tema.
 *              v2.0.0 (Sovereign Path Restoration): Se corrige la ruta de
 *              importación para alinearse con la ACS y restaurar la integridad del build.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---
// Se importa el contrato de tipo desde su SSoT soberana en la capa de schemas.
import type { DiscoveredFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA v2.0.0] ---
import { ThemeFragmentSelector } from "./ThemeFragmentSelector";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { z } from "zod";

type Content = z.infer<typeof Step3ContentSchema>;

interface ThemeSelectorGroupProps {
  content: Pick<
    Content,
    | "themeSelectorTitle"
    | "colorsLabel"
    | "fontsLabel"
    | "radiiLabel"
    | "colorsPlaceholder"
    | "fontsPlaceholder"
    | "radiiPlaceholder"
  >;
  themeConfig: ThemeConfig;
  themeFragments: DiscoveredFragments;
  onThemeConfigChange: (newConfig: Partial<ThemeConfig>) => void;
  isPending: boolean;
}

export function ThemeSelectorGroup({
  content,
  themeConfig,
  themeFragments,
  onThemeConfigChange,
  isPending,
}: ThemeSelectorGroupProps): React.ReactElement {
  logger.trace(
    "[ThemeSelectorGroup] Renderizando grupo de selectores de tema (v2.0)."
  );

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-muted/20">
      <div>
        <h3 className="font-semibold text-lg text-foreground">
          {content.themeSelectorTitle}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ThemeFragmentSelector
          label={content.colorsLabel}
          value={themeConfig.colorPreset}
          onValueChange={(value) => onThemeConfigChange({ colorPreset: value })}
          placeholder={content.colorsPlaceholder}
          options={themeFragments.colors}
          isDisabled={isPending}
        />
        <ThemeFragmentSelector
          label={content.fontsLabel}
          value={themeConfig.fontPreset}
          onValueChange={(value) => onThemeConfigChange({ fontPreset: value })}
          placeholder={content.fontsPlaceholder}
          options={themeFragments.fonts}
          isDisabled={isPending}
        />
        <ThemeFragmentSelector
          label={content.radiiLabel}
          value={themeConfig.radiusPreset}
          onValueChange={(value) =>
            onThemeConfigChange({ radiusPreset: value })
          }
          placeholder={content.radiiPlaceholder}
          options={themeFragments.radii}
          isDisabled={isPending}
        />
      </div>
    </div>
  );
}
