// RUTA: src/shared/lib/actions/notifications/send-order-confirmation.action.tsx
/**
 * @file send-order-confirmation.action.tsx
 * @description Server Action atómica para el envío de correos de confirmación de pedido.
 *              v2.0.0 (Elite & Holistically Correct): Refactorizado a .tsx para
 *              soportar el renderizado de componentes React Email.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import React from "react";

import { OrderConfirmationEmail } from "@/shared/emails/OrderConfirmationEmail";
import { getEmailStyles } from "@/shared/emails/utils/email-styling";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import {
  OrderConfirmationPayloadSchema,
  type OrderConfirmationPayload,
} from "@/shared/lib/schemas/notifications/transactional.schema";
import { sendEmail } from "@/shared/lib/services/resend";
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function sendOrderConfirmationEmailAction(
  payload: OrderConfirmationPayload
): Promise<ActionResult<{ emailId: string }>> {
  const traceId = logger.startTrace("sendOrderConfirmationEmailAction_v2.0");
  logger.info(
    "[Notification Action] Iniciando envío de confirmación de pedido.",
    { traceId }
  );

  try {
    // 1. Validar el payload de entrada contra su contrato estricto.
    const validation = OrderConfirmationPayloadSchema.safeParse(payload);
    if (!validation.success) {
      logger.error(
        "[Notification Action] Payload de confirmación de pedido inválido.",
        {
          errors: validation.error.flatten(),
          traceId,
        }
      );
      return { success: false, error: "Datos para el email inválidos." };
    }
    const { to, orderId, totalAmount, items } = validation.data;

    // 2. Obtener recursos (estilos y contenido i18n).
    const [styles, { dictionary, error: dictError }] = await Promise.all([
      getEmailStyles("default"),
      getDictionary(defaultLocale),
    ]);

    if (dictError || !dictionary.orderConfirmationEmail) {
      throw new Error("No se pudo cargar el contenido i18n para el correo.");
    }
    const emailContent = dictionary.orderConfirmationEmail;
    const subject = emailContent.previewText.replace("{{orderId}}", orderId);

    // 3. Renderizar el componente de React Email.
    const emailComponent = (
      <OrderConfirmationEmail
        content={emailContent}
        orderId={orderId}
        totalAmount={totalAmount}
        items={items}
        styles={styles}
      />
    );

    // 4. Delegar el envío a la capa de servicio.
    return await sendEmail(to, subject, emailComponent);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Notification Action] Fallo crítico al enviar correo de confirmación.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: "No se pudo procesar el envío del correo.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
