// RUTA (NUEVA): src/app/[locale]/(dev)/dev/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada soberano y "Server Shell" para el Developer Command Center.
 *              v2.0.0 (Architectural Route Fix): Movido a la ruta /dev para resolver
 *              el conflicto de enrutamiento con la página de inicio pública.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { DevDashboardClient } from "../_components/DevDashboardClient";
import { notFound } from "next/navigation";

interface DevDashboardPageProps {
  params: { locale: Locale };
}

export default async function DevDashboardPage({
  params: { locale },
}: DevDashboardPageProps) {
  const traceId = logger.startTrace("DCC_Dashboard_Shell_v2.0");
  logger.startGroup(
    `[DCC Shell] Renderizando dashboard para locale: ${locale}`
  );

  try {
    logger.traceEvent(traceId, "Iniciando obtención de diccionario i18n...");
    const { dictionary, error } = await getDictionary(locale);
    const content = dictionary.devDashboardPage;
    logger.traceEvent(traceId, "Obtención de diccionario completada.");

    // --- [INICIO] GUARDIÁN DE RESILIENCIA HOLÍSTICO ---
    if (error || !content || !content.pageHeader || !content.magicBento) {
      const missingKeys = [
        !content && "devDashboardPage",
        !content?.pageHeader && "pageHeader",
        !content?.magicBento && "magicBento",
      ]
        .filter(Boolean)
        .join(", ");

      throw new Error(
        `Fallo al cargar el contenido i18n esencial para el DCC. Claves ausentes: ${missingKeys}`
      );
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA HOLÍSTICO ---

    logger.success(
      "[DCC Shell] Datos obtenidos y validados. Delegando a DevDashboardClient...",
      { traceId }
    );

    return <DevDashboardClient content={content} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[DCC Shell] Fallo crítico irrecuperable en el Server Shell.",
      {
        error: errorMessage,
        traceId,
      }
    );

    // En producción, un fallo aquí debería mostrar una página de no encontrado.
    if (process.env.NODE_ENV === "production") {
      return notFound();
    }

    // En desarrollo, mostramos el error detallado para una depuración inmediata.
    return (
      <DeveloperErrorDisplay
        context="DevDashboardPage (Server Shell)"
        errorMessage="Ocurrió un error inesperado al ensamblar el dashboard del DCC."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
