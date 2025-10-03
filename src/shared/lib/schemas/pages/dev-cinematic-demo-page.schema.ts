// shared/lib/schemas/pages/dev-cinematic-demo-page.schema.ts
/**
 * @file cinematic-demo-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la
 *              página de demostración del motor "Aether".
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";

export const CinematicDemoPageContentSchema = z.object({
  pageHeader: PageHeaderContentSchema,
  loadingText: z.string(),
});

export const CinematicDemoPageLocaleSchema = z.object({
  cinematicDemoPage: CinematicDemoPageContentSchema.optional(),
});
// shared/lib/schemas/pages/dev-cinematic-demo-page.schema.ts
