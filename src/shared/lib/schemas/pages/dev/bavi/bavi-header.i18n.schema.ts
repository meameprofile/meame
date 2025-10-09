// RUTA: src/shared/lib/schemas/pages/dev/bavi/bavi-header.i18n.schema.ts
/**
 * @file bavi-header.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del BaviHeader.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const BaviHeaderContentSchema = z.object({
  searchPlaceholder: z.string(),
  uploadButton: z.string(),
  filterByAILabel: z.string(),
  allAIsOption: z.string(),
});

export const BaviHeaderLocaleSchema = z.object({
  baviHeader: BaviHeaderContentSchema.optional(),
});
