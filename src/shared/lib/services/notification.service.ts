// RUTA: shared/lib/services/notification.service.ts
/**
 * @file notification.service.ts
 * @description Servicio de backend centralizado para la gestión de notificaciones.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createClient } from "@supabase/supabase-js";
import { logger } from "@/shared/lib/logging";

// Usamos el cliente de servicio para operaciones de backend seguras.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ¡Clave de servicio, nunca expuesta al cliente!
);

type NotificationType = "info" | "success" | "warning" | "error";

interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  message: string;
  link?: string;
}

/**
 * @function createNotification
 * @description Crea un nuevo registro de notificación para un usuario. Es una
 *              operación "fire-and-forget" para no bloquear el hilo principal.
 */
export function createNotification(payload: CreateNotificationPayload): void {
  logger.trace(
    "[NotificationService] Solicitud para crear notificación.",
    payload
  );

  // No usamos await aquí intencionadamente. La creación de una notificación
  // es una tarea secundaria y no debe bloquear la respuesta al cliente.
  supabaseAdmin
    .from("notifications")
    .insert({
      user_id: payload.userId,
      type: payload.type,
      message: payload.message,
      link: payload.link,
    })
    .then(({ error }) => {
      if (error) {
        logger.error("Fallo al crear la notificación en la base de datos.", {
          userId: payload.userId,
          error: error.message,
        });
      } else {
        logger.trace("[NotificationService] Notificación creada con éxito.");
      }
    });
}
