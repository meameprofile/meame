// RUTA: src/components/features/dev-tools/SuiteStyleComposer/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos compartidos del ecosistema SuiteStyleComposer.
 * @version 2.0.0 (Sovereign Contract Import)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { LoadedFragments } from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";

// Se re-exporta el tipo soberano para que los componentes locales puedan usarlo.
export type { LoadedFragments };

export interface SuiteThemeConfig extends ThemeConfig {
  granularColors?: Record<string, string>;
  granularFonts?: Record<string, string>;
  granularGeometry?: Record<string, string>;
}
