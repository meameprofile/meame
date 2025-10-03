// Ruta correcta: src/shared/lib/actions/notifications/getNotifications.action.ts
/**
 * @file getNotifications.action.ts
 * @description Server Action segura para obtener las notificaciones de un usuario.
 * @version 2.0.0 (Holistic Integrity & SSoT Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import type { Notification } from "@/shared/lib/types/notifications.types";

export async function getNotificationsAction(): Promise<
  ActionResult<Notification[]>
> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Acción no autorizada." };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    logger.error("Fallo al obtener notificaciones.", {
      userId: user.id,
      error: error.message,
    });
    return {
      success: false,
      error: "No se pudieron obtener las notificaciones.",
    };
  }
  return { success: true, data: data as Notification[] };
}
// Ruta correcta: src/shared/lib/actions/notifications/getNotifications.action.ts
