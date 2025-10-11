// RUTA: src/shared/lib/schemas/components/scrolling-banner.schema.ts
/**
 * @file scrolling-banner.schema.ts
 * @description SSoT para el contrato de datos del componente ScrollingBanner.
 * @version 2.0.0 (Decoupled & Sovereign)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";

export const ScrollingBannerContentSchema = z.object({
  message: z.string().min(1, "El mensaje del banner no puede estar vacío."),
  iconName: LucideIconNameSchema.optional(),
});

export const ScrollingBannerLocaleSchema = z.object({
  scrollingBanner: ScrollingBannerContentSchema.optional(),
});
