// lib/schemas/components/community-section.schema.ts
/**
 * @file community-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente CommunitySection.
 *              - v3.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale para resolver errores de tipo en los consumidores.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/shared/lib/config/lucide-icon-names";

/**
 * @const CommunitySectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección. Es un
 *              ZodObject puro y no opcional.
 */
export const CommunitySectionContentSchema = z.object({
  iconName: LucideIconNameSchema,
  title: z.string().min(1, "El título no puede estar vacío."),
  description: z.string(),
  buttonLabel: z.string(),
  buttonHref: z.string().url("El enlace del botón debe ser una URL válida."),
});

/**
 * @const CommunitySectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const CommunitySectionLocaleSchema = z.object({
  communitySection: CommunitySectionContentSchema.optional(),
});

/**
 * @const CommunitySectionI18nSchema
 * @description Valida la estructura completa del archivo .i18n.json.
 */
export const CommunitySectionI18nSchema = z.object({
  "it-IT": CommunitySectionLocaleSchema,
  "es-ES": CommunitySectionLocaleSchema,
  "en-US": CommunitySectionLocaleSchema,
  "pt-BR": CommunitySectionLocaleSchema,
});
// lib/schemas/components/community-section.schema.ts
