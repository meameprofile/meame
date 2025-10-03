// RUTA: app/[locale]/analytics/page.tsx
/**
 * @file page.tsx
 * @description Página principal para el Dashboard de Analíticas.
 * @version 2.1.0 (Icon SSoT Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { getCampaignAnalyticsAction } from "@/shared/lib/actions/analytics/getCampaignAnalytics.action";
import { DashboardHeader } from "@/components/features/analytics/DashboardHeader";
import { CampaignsTable } from "@/components/features/analytics/CampaignsTable";
import { KPICharts } from "@/components/features/analytics/KPICharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { DynamicIcon } from "@/components/ui";

export default async function AnalyticsPage(): Promise<React.ReactElement> {
  const analyticsResult = await getCampaignAnalyticsAction();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <DashboardHeader />

      {analyticsResult.success ? (
        <>
          <KPICharts data={analyticsResult.data} />
          <CampaignsTable data={analyticsResult.data} />
        </>
      ) : (
        <Alert variant="destructive">
          {/* --- [INICIO DE CORRECCIÓN DE CONTRATO] --- */}
          <DynamicIcon name="TriangleAlert" className="h-4 w-4" />
          {/* --- [FIN DE CORRECCIÓN DE CONTRATO] --- */}
          <AlertTitle>Error al Cargar Datos</AlertTitle>
          <AlertDescription>{analyticsResult.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
