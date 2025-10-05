// APARATO 1: CONTRATO DE DATOS DE ANALÍTICAS
// RUTA: src/shared/lib/schemas/analytics/campaign-analytics.schema.ts

import { z } from "zod";

export const CampaignAnalyticsDataSchema = z.object({
  campaignId: z.string(),
  variantId: z.string(),
  variantName: z.string(),
  summary: z.object({
    totalVisitors: z.number(),
    averageTimeOnPage: z.number(), // en segundos
    bounceRate: z.number(), // en porcentaje (0-100)
    conversions: z.number(),
  }),
  trafficSources: z.array(
    z.object({
      source: z.string(),
      visitors: z.number(),
    })
  ),
  visitorsOverTime: z.array(
    z.object({
      date: z.string(), // "YYYY-MM-DD"
      visitors: z.number(),
    })
  ),
});

export type CampaignAnalyticsData = z.infer<typeof CampaignAnalyticsDataSchema>;
