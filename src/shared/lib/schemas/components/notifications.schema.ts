// RUTA: src/shared/lib/schemas/components/notifications.schema.ts
/**
 * @file notifications.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del ecosistema de notificaciones.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const NotificationBellContentSchema = z.object({
  viewAllNotificationsLink: z.string(),
  notificationsLabel: z.string(),
  noNotificationsText: z.string(),
  loadingText: z.string(),
});

export const NotificationBellLocaleSchema = z.object({
  notificationBell: NotificationBellContentSchema.optional(),
});
