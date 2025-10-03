// lib/schemas/components/features-section.schema.ts
/**
 * @file features-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente FeaturesSection.
 *              - v3.0.0 (Type Safety): Exporta el tipo 'FeatureItem' para garantizar
 *                la seguridad de tipos en el componente consumidor.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [FeaturesSection] v3.0");

const FeatureItemSchema = z.object({
  icon: LucideIconNameSchema,
  title: z.string().min(1),
  description: z.string().min(1),
});

// --- [INICIO] REFACTORIZACIÓN ARQUITECTÓNICA ---
export type FeatureItem = z.infer<typeof FeatureItemSchema>;
// --- [FIN] REFACTORIZACIÓN ARQUITECTÓNICA ---

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
// lib/schemas/components/features-section.schema.ts
