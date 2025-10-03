// lib/schemas/components/pricing-section.schema.ts
/**
 * @file pricing-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente PricingSection.
 *              - v2.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [PricingSection]");

const PricingPlanSchema = z.object({
  title: z.string(),
  isPopular: z.boolean(),
  price: z.number(),
  priceSuffix: z.string(),
  description: z.string(),
  buttonText: z.string(),
  benefitList: z.array(z.string()),
});

export type PricingPlan = z.infer<typeof PricingPlanSchema>;

/**
 * @const PricingSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const PricingSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  currency: z.string().length(3),
  plans: z.array(PricingPlanSchema),
});

/**
 * @const PricingSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const PricingSectionLocaleSchema = z.object({
  pricingSection: PricingSectionContentSchema.optional(),
});

export const PricingSectionI18nSchema = z.object({
  "it-IT": PricingSectionLocaleSchema,
  "es-ES": PricingSectionLocaleSchema,
  "en-US": PricingSectionLocaleSchema,
  "pt-BR": PricingSectionLocaleSchema,
});
// lib/schemas/components/pricing-section.schema.ts
