// RUTA: src/shared/lib/schemas/pages/dev-dashboard.schema.ts
/**
 * @file dev-dashboard.schema.ts
 * @description SSoT para el contrato de datos del DCC Dashboard v5.0,
 *              inspirado en la estructura de Canva.
 * @version 5.0.0 (Canva-Inspired Layout)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { PageHeaderContentSchema } from "../components/page-header.schema";

const ToolCardContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
});

export const DevDashboardContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  mainActions: z.object({
    title: z.string(),
    campaignButton: z.string(),
  }),
  toolsTitle: z.string(),
  tools: z.object({
    sdc: ToolCardContentSchema,
    bavi: ToolCardContentSchema,
    razprompts: ToolCardContentSchema,
    cogniread: ToolCardContentSchema,
    nos3: ToolCardContentSchema,
    analytics: ToolCardContentSchema,
  }),
});

export const DevDashboardLocaleSchema = z.object({
  devDashboardPage: DevDashboardContentSchema.optional(),
});
