// RUTA: src/app/[locale]/(dev)/analytics/[variantId]/page.tsx
/**
 * @file page.tsx
 * @description Página de detalle para la analítica de una variante de campaña específica.
 *              Forjada con observabilidad de élite y un guardián de resiliencia.
 * @version 3.0.0 (Elite & Resilient)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { getCampaignAnalyticsAction } from "@/shared/lib/actions/analytics";
import { KPICharts } from "@/components/features/analytics/KPICharts";
import { StatCard } from "@/components/features/analytics/StatCard";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { logger } from "@/shared/lib/logging";

interface AnalyticsDetailPageProps {
  params: { variantId: string };
}

export default async function AnalyticsDetailPage({
  params,
}: AnalyticsDetailPageProps) {
  const traceId = logger.startTrace(`AnalyticsDetailShell:${params.variantId}`);
  logger.startGroup(`[Analytics Detail Shell] Ensamblando datos...`, traceId);

  try {
    const result = await getCampaignAnalyticsAction();
    if (!result.success) {
      throw new Error(result.error);
    }

    const data = result.data.find((d) => d.variantId === params.variantId);
    if (!data) {
      logger.warn(
        `[Guardián] No se encontraron datos para la variante: ${params.variantId}`,
        { traceId }
      );
      throw new Error(`Variante con ID "${params.variantId}" no encontrada.`);
    }

    logger.success("[Analytics Detail Shell] Datos encontrados y validados.", {
      traceId,
    });

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analíticas: {data.variantName}</h1>
          <p className="text-muted-foreground">
            Análisis detallado de la variante.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Visitantes Totales"
            value={data.summary.totalVisitors}
            icon="Users"
          />
          <StatCard
            title="Conversiones"
            value={data.summary.conversions}
            icon="BadgeCheck"
          />
          <StatCard
            title="Tasa de Rebote"
            value={`${data.summary.bounceRate}%`}
            icon="TrendingDown"
          />
          <StatCard
            title="Tiempo Promedio"
            value={`${data.summary.averageTimeOnPage}s`}
            icon="Timer"
          />
        </div>
        <KPICharts data={[data]} />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Analytics Detail Shell] Fallo crítico al ensamblar.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context={`AnalyticsDetailShell: ${params.variantId}`}
        errorMessage="No se pudieron cargar los datos de la campaña."
        errorDetails={error}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
