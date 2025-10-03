// RUTA: shared/lib/schemas/bavi/sesa-taxonomy.schema.ts
/**
 * @file sesa-taxonomy.schema.ts
 * @description SSoT para el contrato de datos del manifiesto de taxonomía SESA.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const SesaContentSchema
 * @description Valida el contenido de la taxonomía para un único locale.
 */
const SesaContentSchema = z.object({
  categories: z.record(z.string()),
  codes: z.record(z.string()),
});

/**
 * @const SesaTaxonomyLocaleSchema
 * @description Valida la clave de nivel superior (`sesa`) para un locale.
 */
export const SesaTaxonomyLocaleSchema = z.object({
  sesa: SesaContentSchema.optional(),
});

/**
 * @const SesaTaxonomyI18nSchema
 * @description Valida la estructura completa del archivo `sesa-tags.manifest.json`.
 */
export const SesaTaxonomyI18nSchema = z.object({
  "it-IT": SesaTaxonomyLocaleSchema,
  "es-ES": SesaTaxonomyLocaleSchema,
  "en-US": SesaTaxonomyLocaleSchema,
  "pt-BR": SesaTaxonomyLocaleSchema,
});
