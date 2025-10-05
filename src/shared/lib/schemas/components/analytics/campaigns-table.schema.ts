// RUTA: src/shared/lib/schemas/components/analytics/campaigns-table.schema.ts
/**
 * @file campaigns-table.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente CampaignsTable.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CampaignsTableContentSchema = z.object({
  headerVariant: z.string(),
  headerVisitors: z.string(),
  headerConversions: z.string(),
  headerBounceRate: z.string(),
  noResultsText: z.string(),
  previousButton: z.string(),
  nextButton: z.string(),
  actionsLabel: z.string(),
  viewDetailsLabel: z.string(),
});

export const CampaignsTableLocaleSchema = z.object({
  campaignsTable: CampaignsTableContentSchema.optional(),
});
