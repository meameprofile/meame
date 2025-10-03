// RUTA: lib/schemas/components/faq-accordion.schema.ts
/**
 * @file faq-accordion.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente FaqAccordion.
 *              - v4.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [FaqAccordion]");

/**
 * @const FaqItemSchema
 * @description Valida la estructura de un único ítem de FAQ.
 */
const FaqItemSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía."),
  answer: z.string().min(1, "La respuesta no puede estar vacía."),
});

export type FaqItem = z.infer<typeof FaqItemSchema>;

/**
 * @const FaqAccordionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const FaqAccordionContentSchema = z.object({
  title: z.string(),
  faqs: z.array(FaqItemSchema),
});

/**
 * @const FaqAccordionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const FaqAccordionLocaleSchema = z.object({
  faqAccordion: FaqAccordionContentSchema.optional(),
});

export const FaqAccordionI18nSchema = z.object({
  "it-IT": FaqAccordionLocaleSchema,
  "es-ES": FaqAccordionLocaleSchema,
  "en-US": FaqAccordionLocaleSchema,
  "pt-BR": FaqAccordionLocaleSchema,
});
