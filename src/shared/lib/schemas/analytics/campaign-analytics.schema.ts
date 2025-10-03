// RUTA: shared/lib/schemas/analytics/campaign-analytics.schema.ts
/**
 * @file campaign-analytics.schema.ts
 * @description SSoT para el contrato de datos de las analíticas de una campaña.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
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
