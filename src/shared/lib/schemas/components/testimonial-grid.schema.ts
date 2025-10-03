// lib/schemas/components/testimonial-grid.schema.ts
/**
 * @file testimonial-grid.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente TestimonialGrid.
 *              - v3.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [TestimonialGrid]");

/**
 * @const TestimonialSchema
 * @description Valida la estructura de un único testimonio.
 */
const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  location: z.string(),
  imageSrc: z.string().startsWith("/"),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

/**
 * @const TestimonialGridContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const TestimonialGridContentSchema = z.object({
  title: z.string(),
  testimonials: z.array(TestimonialSchema),
});

/**
 * @const TestimonialGridLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const TestimonialGridLocaleSchema = z.object({
  testimonialGrid: TestimonialGridContentSchema.optional(),
});

export const TestimonialGridI18nSchema = z.object({
  "es-ES": TestimonialGridLocaleSchema,
  "pt-BR": TestimonialGridLocaleSchema,
  "en-US": TestimonialGridLocaleSchema,
  "it-IT": TestimonialGridLocaleSchema,
});
// lib/schemas/components/testimonial-grid.schema.ts
