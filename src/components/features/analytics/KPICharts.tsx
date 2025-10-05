// RUTA: src/components/features/analytics/KPICharts.tsx
/**
 * @file KPICharts.tsx
 * @description Componente de presentación para los gráficos de KPI de Aura.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CampaignAnalyticsData } from "@/shared/lib/schemas/analytics/campaign-analytics.schema";
import { logger } from "@/shared/lib/logging";

interface KPIChartsProps {
  data: CampaignAnalyticsData[];
}

export function KPICharts({ data }: KPIChartsProps): React.ReactElement {
  logger.trace("[KPICharts] Renderizando gráficos de analíticas.");
  const trafficSourceData = data.flatMap((d) => d.trafficSources);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Visitantes a lo Largo del Tiempo</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data[0]?.visitorsOverTime}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              {data.map((d, index) => (
                <Line
                  key={d.variantId}
                  type="monotone"
                  dataKey="visitors"
                  data={d.visitorsOverTime}
                  stroke={
                    index === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"
                  }
                  strokeWidth={2}
                  name={d.variantName}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Fuentes de Tráfico</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={trafficSourceData}>
              <XAxis
                dataKey="source"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsla(var(--muted), 0.5)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Bar
                dataKey="visitors"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
