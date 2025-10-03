// shared/lib/schemas/pages/nos3-dashboard.schema.ts
/**
 * @file nos3-dashboard.schema.ts
 * @description SSoT para el contrato de datos i18n de la página del dashboard de Nos3.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";

export const Nos3DashboardContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  tableHeaders: z.object({
    sessionId: z.string(),
    startTime: z.string(),
    actions: z.string(),
  }),
  reproduceButton: z.string(),
  emptyStateTitle: z.string(),
  emptyStateDescription: z.string(),
});

export const Nos3DashboardLocaleSchema = z.object({
  nos3Dashboard: Nos3DashboardContentSchema.optional(),
});
