// RUTA: src/app/[locale]/(dev)/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Soberano y Guardián del DCC, ahora con una higiene de
 *              código impecable y observabilidad de ciclo de vida completo.
 * @version 29.2.0 (Elite Code Hygiene & Full Lifecycle Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import Loading from "./loading";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { generateDevRoutes } from "@/components/features/dev-tools/utils/route-menu.generator";
import { DevSidebar } from "@/components/layout/DevSidebar";
import { GlobalLoader } from "@/components/layout/GlobalLoader";
import Header from "@/components/layout/Header";
import type { HeaderClientProps } from "@/components/layout/HeaderClient";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { getWorkspacesForUserAction } from "@/shared/lib/actions/workspaces/getWorkspacesForUser.action";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { createServerClient } from "@/shared/lib/supabase/server";
import "@/components/features/aether/Aether";

async function DevLayoutDataOrchestrator({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}): Promise<React.ReactElement> {
  const traceId = logger.startTrace(`DevLayout_Orchestrator_v29.2:${locale}`);
  const groupId = logger.startGroup(
    `[DCC Orchestrator] Ensamblando UI para [${locale}]...`
  );

  try {
    const supabase = createServerClient();
    const [
      { dictionary, error: dictError },
      userSession,
      profileResult,
      workspacesResult,
    ] = await Promise.all([
      getDictionary(locale),
      supabase.auth.getUser(),
      getCurrentUserProfile_Action(),
      getWorkspacesForUserAction(),
    ]);

    const requiredI18nKeys: (keyof Dictionary)[] = [
      "userNav",
      "notificationBell",
      "devLoginPage",
      "cart",
      "header",
      "languageSwitcher",
      "devRouteMenu",
      "toggleTheme",
    ];
    const missingKeys = requiredI18nKeys.filter((key) => !dictionary[key]);
    if (dictError || missingKeys.length > 0) {
      throw new Error(
        `Faltan datos de i18n esenciales. Claves ausentes: ${missingKeys.join(", ")}`
      );
    }

    if (!workspacesResult.success) throw new Error(workspacesResult.error);
    const routeGroups = generateDevRoutes(dictionary.devRouteMenu!, locale);

    const headerContent: HeaderClientProps["content"] = {
      header: dictionary.header!,
      toggleTheme: dictionary.toggleTheme!,
      languageSwitcher: dictionary.languageSwitcher!,
      userNav: dictionary.userNav!,
      notificationBell: dictionary.notificationBell!,
      devLoginPage: dictionary.devLoginPage!,
      cart: dictionary.cart!,
    };

    return (
      <div className="flex h-screen bg-muted/40">
        <DevSidebar
          user={userSession.data.user}
          profile={profileResult.success ? profileResult.data : null}
          currentLocale={locale}
          workspaces={workspacesResult.data}
          content={{ ...headerContent, devRouteMenu: dictionary.devRouteMenu! }}
          routeGroups={routeGroups}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            content={headerContent}
            currentLocale={locale}
            centerComponent={
              <h1 className="font-semibold text-lg">
                Centro de Comando del Desarrollador
              </h1>
            }
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
            <GlobalLoader />
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[DCC Orchestrator] Fallo crítico irrecuperable.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="DevLayout Orchestrator"
        errorMessage="No se pudo construir el layout del DCC."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}

export default async function DevLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}): Promise<React.ReactElement> {
  const traceId = logger.startTrace(`DevLayout_AuthGuard_v29.2:${locale}`);
  const groupId = logger.startGroup("[Auth Guard] Verificando sesión...");

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn(
        "[Auth Guard] Usuario no autenticado. Redirigiendo a /login...",
        { traceId }
      );
      redirect(`/${locale}/login`);
    }

    logger.success("[Auth Guard] Sesión válida. Renderizando layout del DCC.", {
      traceId,
    });
    return (
      <Suspense fallback={<Loading />}>
        <DevLayoutDataOrchestrator locale={locale}>
          {children}
        </DevLayoutDataOrchestrator>
      </Suspense>
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
