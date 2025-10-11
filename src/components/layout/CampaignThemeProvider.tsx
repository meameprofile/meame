// Ruta correcta: src/components/layout/CampaignThemeProvider.tsx
/**
 * @file CampaignThemeProvider.tsx
 * @description Componente de Servidor que inyecta las variables CSS de un tema de
 *              campaña directamente en el <head> del documento HTML. Esta técnica
 *              es crucial para prevenir el FOUC (Flash of Unstyled Content).
 * @version 3.3.0 (Sovereign Path Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";

import { logger } from "@/shared/lib/logging";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { generateCssVariablesFromTheme } from "@/shared/lib/utils/theming/theme-utils";

interface CampaignThemeProviderProps {
  theme: AssembledTheme;
  children: React.ReactNode;
}

export function CampaignThemeProvider({
  theme,
  children,
}: CampaignThemeProviderProps): React.ReactElement {
  logger.info(
    "[CampaignThemeProvider] Inyectando tema de campaña en el servidor (v3.3)."
  );

  const styleRule = generateCssVariablesFromTheme(theme);

  return (
    <>
      {styleRule && <style dangerouslySetInnerHTML={{ __html: styleRule }} />}
      {children}
    </>
  );
}
