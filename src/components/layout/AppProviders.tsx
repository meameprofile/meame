// RUTA: src/components/layout/AppProviders.tsx
/**
 * @file AppProviders.tsx
 * @description Orquestador de proveedores del lado del cliente.
 * @version 8.1.0 (Heimdall Telemetry Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect } from "react";

import { HeimdallInitializer } from "@/components/features/analytics/HeimdallInitializer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ProducerLogicWrapper } from "@/shared/hooks/producer-logic";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences";
import { defaultLocale, type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { CookieConsentBanner } from "./CookieConsentBanner";

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
  logger.info("[AppProviders] Inicializando proveedores de cliente (v8.1).");

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
      <HeimdallInitializer />
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
