// lib/schemas/pages/bavi-home-page.schema.ts
/**
 * @file bavi-home-page.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n de la página principal de BAVI.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const BaviHomePageContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ingestCardTitle: z.string(),
  ingestCardDescription: z.string(),
  aiBoilerCardTitle: z.string(),
  aiBoilerCardDescription: z.string(),
});

export const BaviHomePageLocaleSchema = z.object({
  baviHomePage: BaviHomePageContentSchema.optional(),
});
// lib/schemas/pages/bavi-home-page.schema.ts
