// RUTA: src/shared/lib/schemas/components/features-section.schema.ts
/**
 * @file features-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente FeaturesSection.
 *              - v3.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";

const FeatureItemSchema = z.object({
  icon: LucideIconNameSchema,
  title: z.string().min(1),
  description: z.string().min(1),
});

export type FeatureItem = z.infer<typeof FeatureItemSchema>;

export const FeaturesSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  features: z.array(FeatureItemSchema),
});

export const FeaturesSectionLocaleSchema = z.object({
  featuresSection: FeaturesSectionContentSchema.optional(),
});

export const FeaturesSectionI18nSchema = z.object({
  "it-IT": FeaturesSectionLocaleSchema,
  "es-ES": FeaturesSectionLocaleSchema,
  "en-US": FeaturesSectionLocaleSchema,
  "pt-BR": FeaturesSectionLocaleSchema,
});
