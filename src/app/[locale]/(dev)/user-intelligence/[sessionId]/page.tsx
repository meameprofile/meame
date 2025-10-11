// RUTA: src/app/[locale]/(dev)/user-intelligence/[sessionId]/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para la vista de detalle de un perfil de usuario.
 * @version 3.2.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { UserDetailClient } from "@/components/features/user-intelligence/UserDetailClient";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProfiledUserDetailAction } from "@/shared/lib/actions/user-intelligence/getProfiledUserDetail.action";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { UserIntelligenceDetailContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence-detail.i18n.schema";

interface UserDetailPageProps {
  params: { locale: Locale; sessionId: string };
}

export default async function UserDetailPage({
  params: { locale, sessionId },
}: UserDetailPageProps) {
  const traceId = logger.startTrace(`UserDetailPage_Shell_v3.2:${sessionId}`);
  const groupId = logger.startGroup(
    `[UserInt Detail Shell] Ensamblando perfil para ${sessionId}...`
  );

  try {
    const [{ dictionary, error: dictError }, userResult] = await Promise.all([
      getDictionary(locale),
      getProfiledUserDetailAction(sessionId),
    ]);

    const contentValidation = UserIntelligenceDetailContentSchema.safeParse(
      dictionary.userIntelligenceDetailPage
    );

    if (dictError || !contentValidation.success) {
      throw new Error(
        "Faltan datos de i18n o son inválidos para la página de detalle.",
        { cause: dictError || contentValidation.error }
      );
    }
    const content = contentValidation.data;

    if (!userResult.success) throw new Error(userResult.error);

    return (
      <div className="space-y-8">
        <PageHeader content={content.pageHeader} />
        <UserDetailClient
          user={userResult.data}
          content={content}
          locale={locale}
        />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[UserInt Detail Shell] Fallo crítico al ensamblar.", {
      error: errorMessage,
      cause: error instanceof Error ? error.cause : undefined,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="UserDetailPage Shell"
        errorMessage="No se pudo renderizar la página de perfil."
        errorDetails={error instanceof Error ? error : String(error)}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
