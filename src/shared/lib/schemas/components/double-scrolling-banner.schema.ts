// lib/schemas/components/double-scrolling-banner.schema.ts
/**
 * @file double-scrolling-banner.schema.ts
 * @description Esquema de Zod para el contenido del DoubleScrollingBanner.
 *              - v3.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [DoubleScrollingBanner]");

const TestimonialItemSchema = z.object({
  imageSrc: z.string().startsWith("/"),
  altText: z.string(),
  name: z.string(),
  rating: z.number().min(1).max(5),
});

const LogoItemSchema = z.object({
  imageSrc: z.string().startsWith("/"),
  altText: z.string(),
});

export type TestimonialItem = z.infer<typeof TestimonialItemSchema>;
export type LogoItem = z.infer<typeof LogoItemSchema>;

/**
 * @const DoubleScrollingBannerContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const DoubleScrollingBannerContentSchema = z.object({
  testimonials: z.array(TestimonialItemSchema),
  logos: z.array(LogoItemSchema),
});

/**
 * @const DoubleScrollingBannerLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const DoubleScrollingBannerLocaleSchema = z.object({
  doubleScrollingBanner: DoubleScrollingBannerContentSchema.optional(),
});

export const DoubleScrollingBannerI18nSchema = z.object({
  "es-ES": DoubleScrollingBannerLocaleSchema,
  "it-IT": DoubleScrollingBannerLocaleSchema,
  "en-US": DoubleScrollingBannerLocaleSchema,
  "pt-BR": DoubleScrollingBannerLocaleSchema,
});
// lib/schemas/components/double-scrolling-banner.schema.ts
