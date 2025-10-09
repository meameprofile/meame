// RUTA: src/app/[locale]/(dev)/bavi/page.tsx
/**
 * @file page.tsx
 * @description Página principal de la Central de Operaciones BAVI.
 * @version 6.0.0 (Cloudinary-Inspired Refactor)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { getBaviI18nContentAction } from "@/shared/lib/actions/bavi/getBaviI18nContent.action";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { BaviPageClient } from "./_components/BaviPageClient";

export default async function BaviHomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const traceId = logger.startTrace("BaviHomePage_Shell_v6.0");
  const groupId = logger.startGroup("[BaviPage Shell] Ensamblando datos...");

  try {
    const i18nResult = await getBaviI18nContentAction(locale);

    if (!i18nResult.success) {
      throw new Error(i18nResult.error);
    }

    logger.success("[BaviPage Shell] Datos obtenidos. Delegando a cliente...", {
      traceId,
    });

    return <BaviPageClient locale={locale} content={i18nResult.data} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[BaviPage Shell] Fallo crítico.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="BaviHomePage Shell"
        errorMessage="No se pudieron cargar los recursos para la BAVI."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
