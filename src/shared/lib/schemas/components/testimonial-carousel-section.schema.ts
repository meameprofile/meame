// RUTA: src/shared/lib/schemas/components/testimonial-carousel-section.schema.ts
/**
 * @file testimonial-carousel-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del TestimonialCarouselSection.
 *              - v2.1.0 (Build Fix): Se elimina la llamada al logger para resolver
 *                la violación de la frontera servidor-cliente.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

const ReviewItemSchema = z.object({
  image: z.string().startsWith("/"),
  name: z.string(),
  userName: z.string(),
  comment: z.string(),
  rating: z.number().min(1).max(5),
});

export type ReviewItem = z.infer<typeof ReviewItemSchema>;

/**
 * @const TestimonialCarouselSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const TestimonialCarouselSectionContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  reviews: z.array(ReviewItemSchema),
});

/**
 * @const TestimonialCarouselSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const TestimonialCarouselSectionLocaleSchema = z.object({
  testimonialCarouselSection:
    TestimonialCarouselSectionContentSchema.optional(),
});
