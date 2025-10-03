// RUTA: src/app/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Raíz Soberano del Ecosistema. Forjado con Observabilidad de Élite y
 *              un Guardián de Resiliencia Holístico. Es la SSoT para la estructura
 *              fundamental del documento HTML.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import AppProviders from "@/components/layout/AppProviders";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale, defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function RootLayout({
  children,
  params: { locale = defaultLocale },
}: RootLayoutProps) {
  const traceId = logger.startTrace(`RootLayout_Render_v2.0:${locale}`);
  logger.startGroup(
    `[RootLayout Shell] Ensamblando UI raíz para [${locale}]...`
  );

  try {
    // --- [INICIO: GUARDIÁN DE RESILIENCIA] ---
    logger.traceEvent(
      traceId,
      "Obteniendo diccionario para datos de proveedores..."
    );
    const { dictionary, error: dictError } = await getDictionary(locale);

    if (dictError || !dictionary.cookieConsentBanner) {
      logger.error(
        "[Guardián de Resiliencia] No se pudo cargar el contenido para AppProviders (cookie banner). La aplicación continuará sin él.",
        { error: dictError, traceId }
      );
    }
    logger.traceEvent(
      traceId,
      "Datos para proveedores obtenidos de forma resiliente."
    );
    // --- [FIN: GUARDIÁN DE RESILIENCIA] ---

    return (
      <html lang={locale} suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            GeistSans.variable,
            GeistMono.variable
          )}
        >
          <AppProviders
            locale={locale}
            cookieConsentContent={dictionary.cookieConsentBanner}
          >
            {children}
            <Toaster richColors position="top-right" />
          </AppProviders>
        </body>
      </html>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en RootLayout.";
    logger.error("[RootLayout Shell] Fallo crítico irrecuperable.", {
      error: errorMessage,
      traceId,
    });
    return (
      <html lang={locale}>
        <body>
          <DeveloperErrorDisplay
            context="RootLayout"
            errorMessage="No se pudo construir el layout raíz de la aplicación."
            errorDetails={error instanceof Error ? error : errorMessage}
          />
        </body>
      </html>
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
