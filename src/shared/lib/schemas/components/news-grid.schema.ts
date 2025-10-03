// RUTA: src/shared/lib/schemas/components/news-grid.schema.ts
/**
 * @file news-grid.schema.ts
 * @description SSoT para el contrato de datos del componente NewsGrid.
 * @version 4.0.0 (Dynamic Data Ready)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const NewsGridContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

export const NewsGridLocaleSchema = z.object({
  newsGrid: NewsGridContentSchema.optional(),
});
