// RUTA: src/shared/lib/schemas/components/dev/dev-header.schema.ts
/**
 * @file dev-header.schema.ts
 * @description SSoT para el contrato de datos i18n del componente DevHeader.
 *              v3.0.0 (API Contract Alignment): Se alinea con los requisitos
 *              del Header unificado, incluyendo `logoUrl`.
 * @version 3.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DevHeaderContentSchema = z.object({
  title: z.string(),
  logoUrl: z
    .string()
    .startsWith("/", "La URL del logo debe ser una ruta local."),
  logoAlt: z.string(),
  homeLinkAriaLabel: z.string(),
});

export const DevHeaderLocaleSchema = z.object({
  devHeader: DevHeaderContentSchema.optional(),
});
