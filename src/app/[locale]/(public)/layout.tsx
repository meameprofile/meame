// RUTA: src/app/[locale]/(public)/layout.tsx
/**
 * @file layout.tsx
 * @description Layout para el grupo de rutas públicas, con un Guardián de
 *              Resiliencia holístico y ahora alineado con el contrato de i18n soberano.
 * @version 2.2.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface PublicLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function PublicLayout({
  children,
  params: { locale },
}: PublicLayoutProps) {
  const traceId = logger.startTrace(`PublicLayout_Render_v2.2:${locale}`);
  const groupId = logger.startGroup(
    `[PublicLayout] Ensamblando UI para [${locale}]...`
  );

  try {
    const { dictionary, error } = await getDictionary(locale);

    const {
      header,
      toggleTheme,
      languageSwitcher,
      userNav,
      notificationBell,
      devLoginPage,
      cart,
      footer,
    } = dictionary;

    // --- GUARDIÁN DE CONTRATO DE DATOS ---
    if (
      error ||
      !header ||
      !footer ||
      !languageSwitcher ||
      !cart ||
      !userNav ||
      !toggleTheme ||
      !notificationBell ||
      !devLoginPage
    ) {
      const missingKeys = [
        !header && "header",
        !footer && "footer",
        !languageSwitcher && "languageSwitcher",
        !cart && "cart",
        !userNav && "userNav",
        !toggleTheme && "toggleTheme",
        !notificationBell && "notificationBell",
        !devLoginPage && "devLoginPage",
      ]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Faltan datos de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }

    const headerContent = {
      header,
      toggleTheme,
      languageSwitcher,
      userNav,
      notificationBell,
      devLoginPage,
      cart,
    };

    return (
      <>
        <Header content={headerContent} currentLocale={locale} />
        <main>{children}</main>
        <Footer content={footer} />
      </>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[PublicLayout] Fallo crítico al renderizar.", {
      error: errorMessage,
      traceId,
    });
    if (process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="PublicLayout"
          errorMessage="No se pudo construir el layout público."
          errorDetails={error instanceof Error ? error : errorMessage}
        />
      );
    }
    return <>{children}</>;
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
