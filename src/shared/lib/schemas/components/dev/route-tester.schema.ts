// src/lib/schemas/components/dev/route-tester.schema.ts
/**
 * @file route-tester.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente RouteTester.
 * @version 1.0.0
 * @author IA Ingeniera de Software Senior v2.0
 */
import { z } from "zod";

export const RouteTesterLocaleSchema = z.object({
  routeTester: z
    .object({
      devToolsGroup: z.string(),
      campaignPagesGroup: z.string(),
      legalPagesGroup: z.string(),
      campaignDesignSuite: z.string(),
      bridgePage: z.string(),
      reviewPage: z.string(),
      terms: z.string(),
      privacy: z.string(),
      cookies: z.string(),
      changeLanguage: z.string(),
      currentLanguageIs: z.string(),
    })
    .optional(),
});

export const RouteTesterI18nSchema = z.object({
  "es-ES": RouteTesterLocaleSchema,
  "pt-BR": RouteTesterLocaleSchema,
  "en-US": RouteTesterLocaleSchema,
  "it-IT": RouteTesterLocaleSchema,
});
// src/lib/schemas/components/dev/route-tester.schema.ts
