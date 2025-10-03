// RUTA: src/shared/lib/schemas/components/validation-error.schema.ts
/**
 * @file validation-error.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del
 *              componente de élite para errores de validación, `ValidationError`.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ValidationErrorContentSchema = z.object({
  title: z.string().includes("{{sectionName}}"),
  description: z.string(),
  detailsLabel: z.string(),
});

export const ValidationErrorLocaleSchema = z.object({
  validationError: ValidationErrorContentSchema.optional(),
});
