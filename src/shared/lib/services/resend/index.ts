// RUTA: src/shared/lib/services/resend/index.ts
/**
 * @file index.ts
 * @description Capa de Acceso a Datos (DAL) soberana para Resend.
 *              v2.0.0 (Elite & Functional): Implementación completa y robusta
 *              que cumple con los 7 Pilares de Calidad.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { Resend } from "resend";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type React from "react";

// --- Pilar VI: Guardia de Configuración a Nivel de Módulo ---
if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "Error Crítico de Arquitectura: La variable de entorno RESEND_API_KEY no está definida."
  );
}
if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error(
    "Error Crítico de Arquitectura: La variable de entorno RESEND_FROM_EMAIL no está definida."
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

/**
 * @function sendEmail
 * @description Envía un correo electrónico utilizando una plantilla de React Email.
 *              Es la única función en el codebase que interactúa directamente con el SDK de Resend.
 * @param {string} to - El destinatario del correo.
 * @param {string} subject - El asunto del correo.
 * @param {React.ReactElement} reactElement - El componente de React Email a renderizar como cuerpo del correo.
 * @returns {Promise<ActionResult<{ emailId: string }>>} El resultado de la operación.
 */
export async function sendEmail(
  to: string,
  subject: string,
  reactElement: React.ReactElement
): Promise<ActionResult<{ emailId: string }>> {
  const traceId = logger.startTrace("resendDal.sendEmail");
  logger.info(`[Resend DAL] Intentando enviar email a: ${to}`, {
    subject,
    traceId,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      react: reactElement,
    });

    if (error) {
      logger.error("[Resend DAL] La API de Resend devolvió un error.", {
        error,
        traceId,
      });
      return { success: false, error: error.message };
    }

    if (!data?.id) {
      throw new Error("La API de Resend no devolvió un ID de email.");
    }

    logger.success(`[Resend DAL] Email enviado con éxito. ID: ${data.id}`, {
      traceId,
    });
    return { success: true, data: { emailId: data.id } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Resend DAL] Fallo crítico al intentar enviar el email.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo comunicar con el servicio de envío de correos.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
