// RUTA: src/components/features/dev-tools/SuiteStyleComposer/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos compartidos del ecosistema SuiteStyleComposer.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";

export type LoadedFragments = {
  base: Partial<AssembledTheme>;
  colors: Record<string, Partial<AssembledTheme>>;
  fonts: Record<string, Partial<AssembledTheme>>;
  radii: Record<string, Partial<AssembledTheme>>;
};

export interface SuiteThemeConfig extends ThemeConfig {
  granularColors?: Record<string, string>;
  granularFonts?: Record<string, string>;
  granularGeometry?: Record<string, string>;
}
// RUTA: src/components/features/dev-tools/SuiteStyleComposer/types.ts
