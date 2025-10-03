// Ruta correcta: src/shared/lib/types/notifications.types.ts
/**
 * @file notifications.types.ts
 * @description SSoT para el contrato de datos de la entidad Notificación.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.enum(["info", "success", "warning", "error"]),
  message: z.string(),
  link: z.string().nullable(),
  is_read: z.boolean(),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;
// Ruta correcta: src/shared/lib/types/notifications.types.ts```
