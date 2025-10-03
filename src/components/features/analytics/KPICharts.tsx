// RUTA: src/components/features/analytics/KPICharts.tsx
/**
 * @file KPICharts.tsx
 * @description Componente para la visualización de KPIs de analíticas.
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

interface KPIChartsProps {
  data: CampaignAnalyticsData[];
}

export function KPICharts({ data }: KPIChartsProps): React.ReactElement {
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
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              {data.map((d, index) => (
                <Line
                  key={d.variantId}
                  type="monotone"
                  dataKey="visitors"
                  data={d.visitorsOverTime}
                  stroke={index === 0 ? "#8884d8" : "#82ca9d"}
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
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="visitors" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
