// lib/schemas/components/sponsors-section.schema.ts
/**
 * @file sponsors-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente SponsorsSection.
 *              - v2.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [SponsorsSection]");

const SponsorItemSchema = z.object({
  icon: LucideIconNameSchema,
  name: z.string().min(1),
});

export type SponsorItem = z.infer<typeof SponsorItemSchema>;

/**
 * @const SponsorsSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const SponsorsSectionContentSchema = z.object({
  title: z.string(),
  sponsors: z.array(SponsorItemSchema),
});

/**
 * @const SponsorsSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const SponsorsSectionLocaleSchema = z.object({
  sponsorsSection: SponsorsSectionContentSchema.optional(),
});
// lib/schemas/components/sponsors-section.schema.ts
