// Ruta correcta: src/components/layout/AppProviders.tsx
/**
 * @file AppProviders.tsx
 * @description Orquestador de proveedores del lado del cliente.
 *              v6.0.0 (Sovereign Path Restoration): Se corrigen las rutas de
 *              importación de los hooks para alinearse con la SSoT de la
 *              arquitectura de archivos, resolviendo un error crítico de build.
 * @version 6.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { useProducerLogic } from "@/shared/hooks/use-producer-logic";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences";
import { CookieConsentBanner } from "./CookieConsentBanner";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { defaultLocale, type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

interface AppProvidersProps {
  children: React.ReactNode;
  locale?: Locale;
  cookieConsentContent?: Dictionary["cookieConsentBanner"];
}

export default function AppProviders({
  children,
  locale,
  cookieConsentContent,
}: AppProvidersProps): React.ReactElement {
  logger.info("[AppProviders] Inicializando proveedores de cliente (v6.0).");
  useProducerLogic();
  const { preferences, setPreference } = useUserPreferences();
  const safeLocale = locale || defaultLocale;

  useEffect(() => {
    if (safeLocale && preferences.locale !== safeLocale) {
      logger.info(
        `Sincronizando locale de URL ('${safeLocale}') con preferencias de usuario.`
      );
      setPreference("locale", safeLocale);
    }
  }, [safeLocale, preferences.locale, setPreference]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      {cookieConsentContent && (
        <CookieConsentBanner
          content={{
            ...cookieConsentContent,
            policyLinkHref: `/${safeLocale}/cookies`,
          }}
        />
      )}
    </ThemeProvider>
  );
}
