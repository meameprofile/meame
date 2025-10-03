// lib/schemas/components/order-section.schema.ts
/**
 * @file order-section.schema.ts
 * @description Esquema de Zod para el contenido i18n del componente OrderSection.
 *              - v3.0.0 (Architectural Fix): Desacopla el schema de contenido del schema
 *                de locale.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace("[Schema] Definiendo contrato para [OrderSection]");

/**
 * @const OrderSectionContentSchema
 * @description La SSoT para la ESTRUCTURA del contenido de la sección.
 */
export const OrderSectionContentSchema = z.object({
  originalPrice: z
    .number()
    .positive("El precio original debe ser un número positivo."),
  discountedPrice: z
    .number()
    .positive("El precio con descuento debe ser un número positivo."),
  originalPriceLabel: z.string(),
  discountedPriceLabel: z.string(),
  nameInputLabel: z.string(),
  nameInputPlaceholder: z.string(),
  phoneInputLabel: z.string(),
  phoneInputPlaceholder: z.string(),
  submitButtonText: z.string(),
  submitButtonLoadingText: z.string(),
});

/**
 * @const OrderSectionLocaleSchema
 * @description Valida la clave de nivel superior para un locale específico.
 */
export const OrderSectionLocaleSchema = z.object({
  orderSection: OrderSectionContentSchema.optional(),
});

export const OrderSectionI18nSchema = z.object({
  "es-ES": OrderSectionLocaleSchema,
  "pt-BR": OrderSectionLocaleSchema,
  "en-US": OrderSectionLocaleSchema,
  "it-IT": OrderSectionLocaleSchema,
});
// lib/schemas/components/order-section.schema.ts
