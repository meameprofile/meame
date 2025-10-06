// RUTA: src/app/[locale]/(dev)/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Soberano y Guardián del DCC, forjado con una arquitectura
 *              de orquestación de datos pura, observabilidad hiper-granular y
 *              resiliencia de contrato de élite.
 * @version 28.0.0 (Holistic Observability & Contract Integrity)
 * @author L.I.A. Legacy
 */
import "server-only";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { getWorkspacesForUserAction } from "@/shared/lib/actions/workspaces/getWorkspacesForUser.action";
import type { HeaderClientProps } from "@/components/layout/HeaderClient";
import Header from "@/components/layout/Header";
import { DevSidebar } from "@/components/layout/DevSidebar";
import Loading from "./loading";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import {
  generateDevRoutes,
  type RouteGroup,
} from "@/components/features/dev-tools/utils/route-menu.generator";

/**
 * @component DevLayoutDataOrchestrator
 * @description "Server Shell" interno. Su única responsabilidad es orquestar la obtención,
 *              validación y procesamiento de todos los datos necesarios para el layout del DCC.
 * @returns {Promise<React.ReactElement>}
 */
async function DevLayoutDataOrchestrator({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}): Promise<React.ReactElement> {
  const traceId = logger.startTrace(`DevLayout_Orchestrator_v28.0:${locale}`);
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v28.0.0] ---
  const groupId = logger.startGroup(
    `[DCC Orchestrator] Ensamblando UI para [${locale}]...`
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v28.0.0] ---

  try {
    // --- Pilar I: Obtención de Datos Holística y Concurrente ---
    logger.traceEvent(traceId, "Iniciando obtención de datos en paralelo...");
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
    logger.success(
      "[DCC Orchestrator] Todas las fuentes de datos respondieron.",
      { traceId }
    );

    // --- Pilar II: Guardián de Contrato de i18n ---
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
        `Faltan datos de i18n esenciales. Claves ausentes: ${missingKeys.join(
          ", "
        )}`
      );
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    // --- Pilar III: Guardián de Datos de Acciones de Servidor ---
    if (!workspacesResult.success) throw new Error(workspacesResult.error);
    logger.traceEvent(traceId, "Datos de acciones de servidor validados.");

    const routeGroups = generateDevRoutes(dictionary.devRouteMenu!, locale);
    logger.traceEvent(
      traceId,
      `${
        routeGroups.flatMap((g: RouteGroup) => g.items).length
      } rutas de dev generadas.`
    );

    // --- Construcción de Prop de Contenido para Componentes de Cliente ---
    const headerContent: HeaderClientProps["content"] = {
      header: dictionary.header!,
      toggleTheme: dictionary.toggleTheme!,
      languageSwitcher: dictionary.languageSwitcher!,
      userNav: dictionary.userNav!,
      notificationBell: dictionary.notificationBell!,
      devLoginPage: dictionary.devLoginPage!,
      cart: dictionary.cart!,
    };

    logger.success(
      "[DCC Orchestrator] Ensamblaje de datos completado. Renderizando UI...",
      { traceId }
    );
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
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
        errorMessage="No se pudo construir el layout del Developer Command Center."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v28.0.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v28.0.0] ---
  }
}

/**
 * @component DevLayout
 * @description Layout raíz para el grupo (dev). Actúa como un Guardián de Seguridad
 *              que impone la autenticación antes de renderizar cualquier contenido.
 * @returns {Promise<React.ReactElement>}
 */
export default async function DevLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}): Promise<React.ReactElement> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[Auth Guardian] Usuario no autenticado detectado en el layout del DCC. Redirigiendo a /login..."
    );
    redirect(`/${locale}/login`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <DevLayoutDataOrchestrator locale={locale}>
        {children}
      </DevLayoutDataOrchestrator>
    </Suspense>
  );
}
