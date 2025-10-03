// RUTA: src/shared/lib/schemas/entities/order.schema.ts
/**
 * @file order.schema.ts
 * @description SSoT para la entidad de negocio "Pedido". Define el contrato
 *              de datos inmutable para las transacciones en nuestro ecosistema.
 * @version 4.1.3
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  orderId: z.string().cuid2(),
  stripePaymentIntentId: z.string(),
  userId: z.string().uuid().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "succeeded", "failed", "refunded"]),
  customerEmail: z.string().email(),
  items: z.array(OrderItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Order = z.infer<typeof OrderSchema>;
