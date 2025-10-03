// RUTA: src/shared/hooks/use-notification-bell.ts
/**
 * @file use-notification-bell.ts
 * @description Hook "cerebro" soberano para la lógica del NotificationBell.
 * @version 2.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getNotificationsAction } from "@/shared/lib/actions/notifications/getNotifications.action";
import { markNotificationsAsReadAction } from "@/shared/lib/actions/notifications/markNotificationsAsRead.action";
import type { Notification } from "@/shared/lib/types/notifications.types";
import { logger } from "@/shared/lib/logging";

export function useNotificationBell() {
  // --- [INICIO DE INYECCIÓN DE OBSERVABILIDAD] ---
  const traceId = useMemo(
    () => logger.startTrace("useNotificationBell_Lifecycle"),
    []
  );
  // --- [FIN DE INYECCIÓN DE OBSERVABILIDAD] ---

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("[useNotificationBell] Hook montado.", { traceId });

    const fetchNotifications = async () => {
      setIsLoading(true);
      logger.traceEvent(traceId, "Iniciando fetch de notificaciones...");
      const result = await getNotificationsAction();

      if (result.success) {
        setNotifications(result.data);
        const newUnreadCount = result.data.filter((n) => !n.is_read).length;
        setUnreadCount(newUnreadCount);
        logger.success(
          `[useNotificationBell] Notificaciones cargadas: ${result.data.length} total, ${newUnreadCount} no leídas.`,
          { traceId }
        );
      } else {
        logger.error("[useNotificationBell] Fallo al obtener notificaciones.", {
          error: result.error,
          traceId,
        });
      }
      setIsLoading(false);
    };

    fetchNotifications();

    return () => {
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const handleOpenChange = useCallback(
    (openState: boolean) => {
      setIsOpen(openState);
      logger.traceEvent(
        traceId,
        `Panel de notificaciones ${openState ? "abierto" : "cerrado"}.`
      );

      if (openState && unreadCount > 0) {
        logger.traceEvent(
          traceId,
          `Marcando ${unreadCount} notificaciones como leídas...`
        );
        const currentUnread = unreadCount;
        setUnreadCount(0); // Actualización optimista de la UI

        markNotificationsAsReadAction().then((result) => {
          if (!result.success) {
            // --- [INICIO DE GUARDIÁN DE RESILIENCIA] ---
            logger.error(
              "[useNotificationBell] Fallo al marcar notificaciones como leídas. Revirtiendo UI.",
              { error: result.error, traceId }
            );
            setUnreadCount(currentUnread); // Revertir en caso de error
            // --- [FIN DE GUARDIÁN DE RESILIENCIA] ---
          } else {
            logger.success(
              "[useNotificationBell] Notificaciones marcadas como leídas en el servidor.",
              { traceId }
            );
          }
        });
      }
    },
    [unreadCount, traceId]
  );

  return {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    isLoading,
    handleOpenChange,
  };
}
