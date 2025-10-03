// RUTA: src/shared/lib/schemas/components/cart.schema.ts
/**
 * @file cart.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del
 *              ecosistema del Carrito de Compras.
 * @version 2.0.0 (Error Messages)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const CartContentSchema = z.object({
  triggerAriaLabel: z.string().min(1),
  sheetTitle: z.string().min(1),
  emptyStateText: z.string().min(1),
  emptyStateButton: z.string().min(1),
  subtotalLabel: z.string().min(1),
  checkoutButton: z.string().min(1),
  continueShoppingButton: z.string().min(1),
  errors: z.object({
    addItemFailed: z.string(),
    removeItemFailed: z.string(),
    updateItemFailed: z.string(),
    createCartFailed: z.string(),
    emptyCart: z.string(),
    checkoutFailed: z.string(),
  }),
});

export const CartLocaleSchema = z.object({
  cart: CartContentSchema.optional(),
});
