// lib/schemas/components/services-section.schema.ts
/**
 * @file services-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente ServicesSection.
 *              - v2.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [ServicesSection]");

const ServiceItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  isPro: z.boolean(),
});

export type ServiceItem = z.infer<typeof ServiceItemSchema>;

/**
 * @const ServicesSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const ServicesSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  proLabel: z.string(),
  services: z.array(ServiceItemSchema),
});

/**
 * @const ServicesSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const ServicesSectionLocaleSchema = z.object({
  servicesSection: ServicesSectionContentSchema.optional(),
});
// lib/schemas/components/services-section.schema.ts
