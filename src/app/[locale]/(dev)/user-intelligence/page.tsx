// RUTA: src/app/[locale]/(dev)/user-intelligence/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el dashboard de Inteligencia de Usuarios.
 * @version 2.3.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import React, { Suspense } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { UserIntelligenceClient } from "@/components/features/user-intelligence/UserIntelligenceClient";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProfiledUsersAction } from "@/shared/lib/actions/user-intelligence/getProfiledUsers.action";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import {
  UserIntelligenceContentSchema,
  type UserIntelligenceContent,
} from "@/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema";

interface UserIntelligencePageProps {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
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
  content: UserIntelligenceContent;
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
  const traceId = logger.startTrace("UserIntelligencePage_Shell_v2.3");
  const groupId = logger.startGroup(
    `[UserInt Shell] Ensamblando dashboard...`,
    traceId
  );

  try {
    const page =
      typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
    const limit = 20;

    const { dictionary, error: dictError } = await getDictionary(locale);
    const contentValidation = UserIntelligenceContentSchema.safeParse(
      dictionary.userIntelligencePage
    );

    if (dictError || !contentValidation.success) {
      throw new Error("Faltan datos de i18n o son inválidos para esta página.");
    }
    const content = contentValidation.data;
    logger.traceEvent(traceId, "Contenido i18n validado.");

    return (
      <div className="space-y-8">
        <PageHeader content={content.pageHeader} />
        <Card>
          <CardContent className="pt-6">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <UserIntelligenceDataLoader
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
        errorDetails={error instanceof Error ? error : String(error)}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
