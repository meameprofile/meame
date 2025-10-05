// RUTA: src/components/layout/AppProviders.tsx
/**
 * @file AppProviders.tsx
 * @description Orquestador de proveedores del lado del cliente.
 * @version 7.1.0 (ProducerLogic Filename Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ProducerLogicWrapper } from "@/shared/hooks/producer-logic"; // <-- RUTA DE IMPORTACIÓN CORREGIDA
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
  logger.info("[AppProviders] Inicializando proveedores de cliente (v7.1).");

  const { preferences, setPreference } = useUserPreferences();
  const safeLocale = locale || defaultLocale;

  useEffect(() => {
    if (safeLocale && preferences.locale !== safeLocale) {
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
      <ProducerLogicWrapper />
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
