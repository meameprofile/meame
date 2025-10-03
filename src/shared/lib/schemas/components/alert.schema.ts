// shared/lib/schemas/components/alert.schema.ts
/**
 * @file alert.schema.ts
 * @description SSoT para el contrato de datos i18n del componente Alert.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const AlertContentSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const AlertLocaleSchema = z.object({
  alert: AlertContentSchema.optional(),
});
