// lib/schemas/bavi/bavi.search-index.schema.ts
/**
 * @file bavi.search-index.schema.ts
 * @description SSoT para el contrato de datos del índice de búsqueda de BAVI.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const BaviSearchIndexSchema = z.object({
  version: z.string(),
  index: z.record(z.array(z.string())),
});

export type BaviSearchIndex = z.infer<typeof BaviSearchIndexSchema>;
