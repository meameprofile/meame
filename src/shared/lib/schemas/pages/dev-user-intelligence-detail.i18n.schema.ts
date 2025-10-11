// RUTA: src/shared/lib/schemas/pages/dev-user-intelligence-detail.i18n.schema.ts
import { z } from "zod";

import { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";

export const UserIntelligenceDetailContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  summaryCardTitle: z.string(),
  sessionCardTitle: z.string(),
  activityCardTitle: z.string(),
  nos3Button: z.string(),
  labels: z.object({
    userId: z.string(),
    fingerprintId: z.string(),
    ipAddress: z.string(),
    country: z.string(),
    city: z.string(),
    browser: z.string(),
    os: z.string(),
    device: z.string(),
  }),
  eventTableHeaders: z.object({
    event: z.string(),
    campaign: z.string(),
    timestamp: z.string(),
    details: z.string(),
  }),
});

export const UserIntelligenceDetailLocaleSchema = z.object({
  userIntelligenceDetailPage: UserIntelligenceDetailContentSchema.optional(),
});
