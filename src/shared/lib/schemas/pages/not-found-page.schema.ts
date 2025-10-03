// lib/schemas/pages/not-found-page.schema.ts
/**
 * @file not-found-page.schema.ts
 * @description Esquema de Zod y SSoT para el contrato de datos de la página 404.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

/**
 * @const NotFoundPageLocaleSchema
 * @description Valida la estructura del contenido de la página 404 para un único locale.
 */
export const NotFoundPageLocaleSchema = z.object({
  notFoundPage: z
    .object({
      title: z.string(),
      description: z.string(),
      buttonText: z.string(),
    })
    .optional(),
});
// lib/schemas/pages/not-found-page.schema.ts
