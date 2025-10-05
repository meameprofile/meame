// RUTA: src/app/[locale]/(dev)/user-intelligence/[sessionId]/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para la vista de detalle de un perfil de usuario.
 * @version 2.0.0 (Sovereign Contract Restoration & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use server";

import React from "react";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { logger } from "@/shared/lib/logging";
import { PageHeader } from "@/components/layout/PageHeader";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { getProfiledUserDetailAction } from "@/shared/lib/actions/user-intelligence/getProfiledUserDetail.action";
import { UserDetailClient } from "@/components/features/user-intelligence/UserDetailClient";

interface UserDetailPageProps {
  params: { locale: Locale; sessionId: string };
}

export default async function UserDetailPage({
  params: { locale, sessionId },
}: UserDetailPageProps) {
  const traceId = logger.startTrace(`UserDetailPage_Shell_v2.0:${sessionId}`);
  logger.startGroup(
    `[UserInt Detail Shell] Ensamblando perfil para ${sessionId}...`
  );

  try {
    const [{ dictionary, error: dictError }, userResult] = await Promise.all([
      getDictionary(locale),
      getProfiledUserDetailAction(sessionId),
    ]);

    const content = dictionary.userIntelligenceDetailPage;
    if (dictError || !content)
      throw new Error("Faltan datos de i18n para la página de detalle.");
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
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="UserDetailPage Shell"
        errorMessage="No se pudo renderizar la página de perfil."
        errorDetails={error}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
