// RUTA: src/shared/lib/schemas/bavi/sesa-taxonomy.schema.ts
/**
 * @file sesa-taxonomy.schema.ts
 * @description SSoT para el contrato de datos del manifiesto de taxonomía SESA.
 * @version 2.0.0 (Global & Agnostic)
 * @author L.I.A. Legacy
 */
import { z } from "zod";

const SesaCategorySchema = z.object({
  label: z.string(),
});

const SesaCodeSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const SesaTaxonomySchema = z.object({
  version: z.string(),
  categories: z.record(SesaCategorySchema),
  codes: z.record(z.array(SesaCodeSchema)),
});

export type SesaTaxonomy = z.infer<typeof SesaTaxonomySchema>;
