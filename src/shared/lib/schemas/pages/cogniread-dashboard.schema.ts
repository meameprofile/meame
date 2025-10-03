// shared/lib/schemas/pages/cogniread-dashboard.schema.ts
/**
 * @file cogniread-dashboard.schema.ts
 * @description SSoT para el contrato de datos i18n de la página del dashboard de CogniRead.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CogniReadDashboardContentSchema = z.object({
  pageHeader: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  newArticleButton: z.string(),
  articlesListTitle: z.string(),
  articlesListDescription: z.string(),
});

export const CogniReadDashboardLocaleSchema = z.object({
  cogniReadDashboard: CogniReadDashboardContentSchema.optional(),
});
