// Ruta correcta: src/shared/lib/actions/notifications/markNotificationsAsRead.action.ts
/**
 * @file markNotificationsAsRead.action.ts
 * @description Server Action segura para marcar notificaciones como leídas.
 * @version 1.1.0 (Holistic Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function markNotificationsAsReadAction(): Promise<
  ActionResult<null>
> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[Action] Intento no autorizado para marcar notificaciones como leídas."
    );
    return { success: false, error: "Acción no autorizada." };
  }

  logger.trace(
    "[Action] Marcando notificaciones como leídas para el usuario.",
    { userId: user.id }
  );

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    logger.error("Fallo al actualizar el estado de las notificaciones.", {
      userId: user.id,
      error: error.message,
    });
    return {
      success: false,
      error: "No se pudieron actualizar las notificaciones.",
    };
  }

  revalidatePath("/(app)", "layout");
  revalidatePath("/notifications");

  return { success: true, data: null };
}
// Ruta correcta: src/shared/lib/actions/notifications/markNotificationsAsRead.action.ts
