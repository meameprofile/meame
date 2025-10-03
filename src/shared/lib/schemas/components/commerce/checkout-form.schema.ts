// RUTA: src/shared/lib/schemas/components/commerce/checkout-form.schema.ts
/**
 * @file checkout-form.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del componente CheckoutForm.
 * @version 9.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CheckoutFormContentSchema = z.object({
  title: z.string(),
  payButton: z.string(),
  processingButton: z.string(),
  unexpectedError: z.string(),
});

export const CheckoutFormLocaleSchema = z.object({
  checkoutForm: CheckoutFormContentSchema.optional(),
});
