// RUTA: src/app/[locale]/(dev)/user-intelligence/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el dashboard de Inteligencia de Usuarios.
 * @version 2.0.0 (Sovereign Contract Restoration & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use server";

import React, { Suspense } from "react";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { logger } from "@/shared/lib/logging";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { getProfiledUsersAction } from "@/shared/lib/actions/user-intelligence/getProfiledUsers.action";
import { UserIntelligenceClient } from "@/components/features/user-intelligence/UserIntelligenceClient";

interface UserIntelligencePageProps {
  params: { locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function UserIntelligenceDataLoader({
  page,
  limit,
  locale,
  content,
}: {
  page: number;
  limit: number;
  locale: Locale;
  content: any;
}) {
  const result = await getProfiledUsersAction({ page, limit });

  if (!result.success) {
    return (
      <DeveloperErrorDisplay
        context="UserIntelligenceDataLoader"
        errorMessage="No se pudieron cargar los perfiles de usuario."
        errorDetails={result.error}
      />
    );
  }

  return (
    <UserIntelligenceClient
      initialData={result.data}
      content={content}
      locale={locale}
    />
  );
}

export default async function UserIntelligencePage({
  params: { locale },
  searchParams,
}: UserIntelligencePageProps) {
  const traceId = logger.startTrace("UserIntelligencePage_Shell_v2.0");
  logger.startGroup(`[UserInt Shell] Ensamblando dashboard...`, traceId);

  try {
    const page =
      typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
    const limit = 20;

    const { dictionary, error: dictError } = await getDictionary(locale);
    const content = dictionary.userIntelligencePage;

    if (dictError || !content) {
      throw new Error("Faltan datos de i18n esenciales para esta página.");
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    return (
      <div className="space-y-8">
        <PageHeader content={content.pageHeader} />
        <Card>
          <CardContent className="pt-6">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <UserDataLoader
                page={page}
                limit={limit}
                locale={locale}
                content={content}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[UserInt Shell] Fallo crítico al ensamblar.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="UserIntelligencePage Shell"
        errorMessage="No se pudo renderizar la página."
        errorDetails={error}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
