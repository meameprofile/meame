// RUTA: src/shared/lib/schemas/components/analytics/dashboard-header.schema.ts
/**
 * @file dashboard-header.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente DashboardHeader.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DashboardHeaderContentSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  subtitle: z.string().min(1, "El subtítulo es requerido."),
  dateRangeButton: z.string(),
  exportButton: z.string(),
});

export const DashboardHeaderLocaleSchema = z.object({
  dashboardHeader: DashboardHeaderContentSchema.optional(),
});
