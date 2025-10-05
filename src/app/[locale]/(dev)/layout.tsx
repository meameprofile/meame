// RUTA: src/app/[locale]/(dev)/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Soberano y Guardián del DCC, con integridad arquitectónica, de tipos e higiene restaurada.
 * @version 23.0.0 (Holistic i18n Contract Alignment): Se elimina el paso de la prop
 *              obsoleta 'supportedLocales' para alinear todo el layout del DCC
 *              con la arquitectura de internacionalización soberana.
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import Loading from "./loading";
import { DevSidebar } from "@/components/layout/DevSidebar";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";

async function DevLayoutDataOrchestrator({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const traceId = logger.startTrace(`DevLayout_Orchestrator_v23.0:${locale}`);
  logger.startGroup(`[DCC Orchestrator] Ensamblando UI para [${locale}]...`);

  try {
    const supabase = createServerClient();
    const [{ dictionary, error }, userSession, profileResult] =
      await Promise.all([
        getDictionary(locale),
        supabase.auth.getUser(),
        getCurrentUserProfile_Action(),
      ]);

    if (
      error ||
      !dictionary.userNav ||
      !dictionary.notificationBell ||
      !dictionary.devLoginPage ||
      !dictionary.cart ||
      !dictionary.header ||
      !dictionary.languageSwitcher
    ) {
      throw new Error(
        "Faltan datos de i18n esenciales para el layout del DCC."
      );
    }

    return (
      <div className="flex h-screen bg-muted/30">
        {/* --- [INICIO DE NIVELACIÓN DE CONTRATO v23.0.0] --- */}
        {/* La prop 'supportedLocales' ha sido eliminada de la llamada,
            resolviendo la fractura de contrato. */}
        <DevSidebar
          user={userSession.data.user}
          profile={profileResult.success ? profileResult.data : null}
          currentLocale={locale}
          content={{
            userNav: dictionary.userNav,
            notificationBell: dictionary.notificationBell,
            devLoginPage: dictionary.devLoginPage,
            cart: dictionary.cart,
            header: dictionary.header,
            languageSwitcher: dictionary.languageSwitcher,
          }}
        />
        {/* --- [FIN DE NIVELACIÓN DE CONTRATO v23.0.0] --- */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[DCC Orchestrator] Fallo crítico.", {
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
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

export default async function DevLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[Auth Guardian] Usuario no autenticado. Redirigiendo a login..."
    );
    return redirect(`/${locale}/login`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <DevLayoutDataOrchestrator locale={locale}>
        {children}
      </DevLayoutDataOrchestrator>
    </Suspense>
  );
}
