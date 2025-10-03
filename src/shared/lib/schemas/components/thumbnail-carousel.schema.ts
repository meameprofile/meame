// lib/schemas/components/thumbnail-carousel.schema.ts
/**
 * @file thumbnail-carousel.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente ThumbnailCarousel.
 *              - v4.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [ThumbnailCarousel]");

/**
 * @const ThumbnailSchema
 * @description Valida la estructura de una única miniatura del carrusel.
 */
const ThumbnailSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string(),
});

export type Thumbnail = z.infer<typeof ThumbnailSchema>;

/**
 * @const ThumbnailCarouselContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const ThumbnailCarouselContentSchema = z.object({
  thumbnails: z.array(ThumbnailSchema),
  affiliateUrl: z.string(),
  playButtonAriaLabel: z.string(),
  playButtonTitle: z.string(),
});

/**
 * @const ThumbnailCarouselLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const ThumbnailCarouselLocaleSchema = z.object({
  thumbnailCarousel: ThumbnailCarouselContentSchema.optional(),
});

export const ThumbnailCarouselI18nSchema = z.object({
  "es-ES": ThumbnailCarouselLocaleSchema,
  "pt-BR": ThumbnailCarouselLocaleSchema,
  "en-US": ThumbnailCarouselLocaleSchema,
  "it-IT": ThumbnailCarouselLocaleSchema,
});
// lib/schemas/components/thumbnail-carousel.schema.ts
