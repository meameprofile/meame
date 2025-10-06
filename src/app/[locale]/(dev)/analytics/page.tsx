// RUTA: src/app/[locale]/(dev)/analytics/page.tsx
/**
 * @file page.tsx
 * @description Página "Server Shell" soberana para el Dashboard de Analíticas.
 * @version 4.0.0 (Heimdall Compliance)
 * @author L.I.A. Legacy
 */
"use server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { getCampaignAnalyticsAction } from "@/shared/lib/actions/analytics";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { DashboardHeader } from "@/components/features/analytics/DashboardHeader";
import { StatCard } from "@/components/features/analytics/StatCard";
import { KPICharts } from "@/components/features/analytics/KPICharts";
import { CampaignsTable } from "@/components/features/analytics/CampaignsTable";
import { motion } from "framer-motion";
import { DashboardHeaderContentSchema } from "@/shared/lib/schemas/components/analytics/dashboard-header.schema";
import { CampaignsTableContentSchema } from "@/shared/lib/schemas/components/analytics/campaigns-table.schema";

export default async function AnalyticsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const traceId = logger.startTrace("AnalyticsPage_ServerShell_v4.0");
  const groupId = logger.startGroup(
    `[Analytics Shell] Ensamblando Dashboard...`
  );

  try {
    const [{ dictionary, error: dictError }, analyticsResult] =
      await Promise.all([getDictionary(locale), getCampaignAnalyticsAction()]);
    const headerContentValidation = DashboardHeaderContentSchema.safeParse(
      dictionary.dashboardHeader
    );
    const tableContentValidation = CampaignsTableContentSchema.safeParse(
      dictionary.campaignsTable
    );

    if (
      dictError ||
      !headerContentValidation.success ||
      !tableContentValidation.success
    ) {
      throw new Error(
        "Faltan datos de i18n esenciales o son inválidos para el dashboard.",
        {
          cause:
            dictError ||
            headerContentValidation.error ||
            tableContentValidation.error,
        }
      );
    }
    const dashboardHeader = headerContentValidation.data;
    const campaignsTableContent = tableContentValidation.data;
    logger.traceEvent(traceId, "Contenido i18n validado.");

    if (!analyticsResult.success) throw new Error(analyticsResult.error);
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
      <div className="space-y-8">
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
        </motion.div>
        <KPICharts data={analyticsData} />
        <CampaignsTable
          data={analyticsData}
          content={campaignsTableContent}
          locale={locale}
        />
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
        errorDetails={error instanceof Error ? error : String(error)}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
