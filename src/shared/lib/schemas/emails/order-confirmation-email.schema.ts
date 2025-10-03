// RUTA: src/shared/lib/schemas/emails/order-confirmation-email.schema.ts
/**
 * @file order-confirmation-email.schema.ts
 * @description SSoT para el contrato de contenido del correo de confirmación de pedido.
 *              v2.0.0 (Elite Type Export & TSDoc): Ahora exporta explícitamente el tipo
 *              inferido y añade documentación TSDoc para cada propiedad, mejorando la
 *              auto-documentación y la DX.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const OrderConfirmationEmailContentSchema = z.object({
  /**
   * @property previewText - El texto de previsualización que aparece en la bandeja de entrada del cliente.
   *                         Debe incluir el placeholder {{orderId}}.
   */
  previewText: z.string().includes("{{orderId}}"),
  /**
   * @property title - El encabezado principal dentro del cuerpo del correo.
   */
  title: z.string(),
  /**
   * @property greeting - El saludo inicial, que puede incluir formato Markdown.
   *                      Debe incluir el placeholder {{orderId}}.
   */
  greeting: z.string().includes("{{orderId}}"),
  /**
   * @property summaryLabel - La etiqueta para la sección de resumen del pedido.
   */
  summaryLabel: z.string(),
  /**
   * @property totalLabel - La etiqueta para el total del pedido.
   */
  totalLabel: z.string(),
  /**
   * @property footerText - El texto que aparece en el pie de página del correo.
   */
  footerText: z.string(),
});

export type OrderConfirmationEmailContent = z.infer<
  typeof OrderConfirmationEmailContentSchema
>;

export const OrderConfirmationEmailLocaleSchema = z.object({
  orderConfirmationEmail: OrderConfirmationEmailContentSchema,
});
// RUTA: src/shared/lib/schemas/emails/order-confirmation-email.schema.ts
