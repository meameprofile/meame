// RUTA: src/app/[locale]/(dev)/dev/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada soberano y "Server Shell" para el Developer Command Center.
 *              v4.2.0 (Holistic Observability & Contract Integrity): Refactorizado para
 *              cumplir con el contrato de API del logger soberano v20+ y enriquecido
 *              con una trazabilidad hiper-granular de su ciclo de vida.
 * @version 4.2.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { DevDashboardClient } from "../_components/DevDashboardClient";
import { notFound } from "next/navigation";
import { DevDashboardContentSchema } from "@/shared/lib/schemas/pages/dev-dashboard.schema";

interface DevDashboardPageProps {
  params: { locale: Locale };
}

export default async function DevDashboardPage({
  params: { locale },
}: DevDashboardPageProps) {
  const traceId = logger.startTrace("DCC_Dashboard_Shell_v4.2");
  // --- [INICIO DE CORRECCIÓN DE CONTRATO v4.2.0] ---
  const groupId = logger.startGroup(
    `[DCC Shell] Renderizando dashboard para locale: ${locale}`
  );
  // --- [FIN DE CORRECCIÓN DE CONTRATO v4.2.0] ---

  try {
    logger.traceEvent(traceId, "Iniciando obtención de diccionario...");
    const { dictionary, error } = await getDictionary(locale);
    logger.traceEvent(traceId, "Obtención de diccionario completada.");

    logger.traceEvent(traceId, "Validando contenido contra el schema Zod...");
    const validation = DevDashboardContentSchema.safeParse(
      dictionary.devDashboardPage
    );

    if (error || !validation.success) {
      throw new Error(
        `Fallo al cargar o validar el contenido i18n para el DCC.`,
        { cause: error || validation.error }
      );
    }
    const content = validation.data;
    logger.traceEvent(traceId, "Contenido i18n validado con éxito.");

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
        traceId, // Se añade traceId para una depuración correlacionada.
      }
    );

    if (process.env.NODE_ENV === "production") {
      return notFound();
    }

    return (
      <DeveloperErrorDisplay
        context="DevDashboardPage (Server Shell)"
        errorMessage="Ocurrió un error inesperado al ensamblar el dashboard del DCC."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v4.2.0] ---
    logger.endGroup(groupId);
    logger.endTrace(traceId);
    // --- [FIN DE CORRECCIÓN DE CONTRATO v4.2.0] ---
  }
}
