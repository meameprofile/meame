// lib/schemas/components/guarantee-section.schema.ts
/**
 * @file guarantee-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente GuaranteeSection.
 *              - v4.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [GuaranteeSection]");

/**
 * @const SealSchema
 * @description Valida la estructura de un único sello de garantía.
 */
const SealSchema = z.object({
  imageUrl: z.string().startsWith("/"),
  imageAlt: z.string(),
});

export type Seal = z.infer<typeof SealSchema>;

/**
 * @const GuaranteeSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const GuaranteeSectionContentSchema = z.object({
  title: z.string(),
  seals: z.array(SealSchema),
});

/**
 * @const GuaranteeSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const GuaranteeSectionLocaleSchema = z.object({
  guaranteeSection: GuaranteeSectionContentSchema.optional(),
});

export const GuaranteeSectionI18nSchema = z.object({
  "es-ES": GuaranteeSectionLocaleSchema,
  "it-IT": GuaranteeSectionLocaleSchema,
  "en-US": GuaranteeSectionLocaleSchema,
  "pt-BR": GuaranteeSectionLocaleSchema,
});
// lib/schemas/components/guarantee-section.schema.ts
