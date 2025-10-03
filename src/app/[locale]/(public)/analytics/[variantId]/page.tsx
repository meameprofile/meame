// RUTA: app/[locale]/analytics/[variantId]/page.tsx
/**
 * @file page.tsx
 * @description Página de detalle para la analítica de una variante específica.
 * @version 2.0.0 (Refactorizado y Nivelado)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getCampaignAnalyticsAction } from "@/shared/lib/actions/analytics/getCampaignAnalytics.action";
import { KPICharts } from "@/components/features/analytics/KPICharts";
import { StatCard } from "@/components/features/analytics/StatCard";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";

interface AnalyticsDetailPageProps {
  params: { variantId: string };
}

export default async function AnalyticsDetailPage({
  params,
}: AnalyticsDetailPageProps) {
  const result = await getCampaignAnalyticsAction();
  if (!result.success) {
    return (
      <DeveloperErrorDisplay
        context="AnalyticsDetail"
        errorMessage={result.error}
      />
    );
  }

  const data = result.data.find((d) => d.variantId === params.variantId);
  if (!data) {
    return (
      <DeveloperErrorDisplay
        context="AnalyticsDetail"
        errorMessage="Variante no encontrada."
      />
    );
  }

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
}
