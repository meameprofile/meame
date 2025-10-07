// RUTA: src/app/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Raíz Soberano, nivelado a un estándar de élite con
 *              observabilidad hiper-granular y resiliencia de contrato.
 * @version 5.0.0 (Holistic Elite Leveling)
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
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function RootLayout({
  children,
  params: { locale = defaultLocale },
}: RootLayoutProps) {
  // --- [INICIO DE REFACTORIZACIÓN DE OBSERVABILIDAD v5.0.0] ---
  const traceId = logger.startTrace(`RootLayout_Render_v5.0:${locale}`);
  // Se captura el ID del grupo para una finalización de log correcta.
  const groupId = logger.startGroup(
    `[RootLayout Shell] Ensamblando UI raíz para [${locale}]...`
  );
  // --- [FIN DE REFACTORIZACIÓN DE OBSERVABILIDAD v5.0.0] ---

  try {
    logger.traceEvent(traceId, "Iniciando obtención de diccionario...");
    const { dictionary, error: dictError } = await getDictionary(locale);
    logger.traceEvent(traceId, "Obtención de diccionario completada.");

    // Guardián de Resiliencia para el contenido del banner de cookies
    if (dictError || !dictionary.cookieConsentBanner) {
      logger.error(
        "[Guardián] No se pudo cargar el contenido esencial para AppProviders.",
        { error: dictError, traceId }
      );
      // Aunque falle, intentamos renderizar una estructura base.
    }

    logger.traceEvent(
      traceId,
      "Ensamblaje de datos completado. Renderizando estructura HTML..."
    );

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
    // --- [INICIO DE REFACTORIZACIÓN DE OBSERVABILIDAD v5.0.0] ---
    // Se asegura que el traceId se propague al log de error.
    logger.error("[RootLayout Shell] Fallo crítico irrecuperable.", {
      error: errorMessage,
      traceId,
    });
    // --- [FIN DE REFACTORIZACIÓN DE OBSERVABILIDAD v5.0.0] ---
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
    // --- [INICIO DE CORRECCIÓN DE CONTRATO Y OBSERVABILIDAD v5.0.0] ---
    // Se pasa el groupId requerido a endGroup.
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO Y OBSERVABILIDAD v5.0.0] ---
  }
}
