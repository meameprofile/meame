// RUTA: src/app/[locale]/(dev)/analytics/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el Dashboard de Analíticas.
 *              Forjada con un guardián de resiliencia holístico y observabilidad de élite.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { getCampaignAnalyticsAction } from "@/shared/lib/actions/analytics";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { DashboardHeader } from "@/components/features/analytics/DashboardHeader";
import { StatCard } from "@/components/features/analytics/StatCard";
import { KPICharts } from "@/components/features/analytics/KPICharts";
import { CampaignsTable } from "@/components/features/analytics/CampaignsTable";
import { motion } from "framer-motion";

export default async function AnalyticsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const traceId = logger.startTrace("AnalyticsPage_ServerShell_v1.0");
  logger.startGroup(`[Analytics Shell] Ensamblando Dashboard...`, traceId);

  try {
    const [{ dictionary, error: dictError }, analyticsResult] =
      await Promise.all([getDictionary(locale), getCampaignAnalyticsAction()]);

    const { dashboardHeader, campaignsTable } = dictionary;

    // Guardián de Resiliencia de Contrato
    if (dictError || !dashboardHeader || !campaignsTable) {
      throw new Error("Faltan datos de i18n esenciales para el dashboard.");
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    // Guardián de Resiliencia de Datos
    if (!analyticsResult.success) {
      throw new Error(analyticsResult.error);
    }
    const analyticsData = analyticsResult.data;
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${analyticsData.length} registros de analíticas.`
    );

    const totalSummary = analyticsData.reduce(
      (acc, current) => {
        acc.totalVisitors += current.summary.totalVisitors;
        acc.conversions += current.summary.conversions;
        return acc;
      },
      { totalVisitors: 0, conversions: 0 }
    );

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DashboardHeader content={dashboardHeader} />
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <StatCard
            title="Visitantes Totales"
            value={totalSummary.totalVisitors}
            icon="Users"
          />
          <StatCard
            title="Conversiones Totales"
            value={totalSummary.conversions}
            icon="BadgeCheck"
          />
          {/* Aquí se pueden añadir más KPIs agregados si se desea */}
        </motion.div>
        <KPICharts data={analyticsData} />
        <CampaignsTable data={analyticsData} content={campaignsTable} />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Analytics Shell] Fallo crítico al ensamblar el dashboard.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="AnalyticsPage Shell"
        errorMessage="No se pudieron cargar los datos de analíticas."
        errorDetails={error}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
