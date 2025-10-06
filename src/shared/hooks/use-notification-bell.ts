// RUTA: src/shared/hooks/use-notification-bell.ts
/**
 * @file use-notification-bell.ts
 * @description Hook "cerebro" soberano para la lógica del NotificationBell.
 * @version 4.0.0 (Elite Code Hygiene & Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getNotificationsAction } from "@/shared/lib/actions/notifications/getNotifications.action";
import { markNotificationsAsReadAction } from "@/shared/lib/actions/notifications/markNotificationsAsRead.action";
import type { Notification } from "@/shared/lib/types/notifications.types";
import { logger } from "@/shared/lib/logging";

export function useNotificationBell() {
  const traceId = useMemo(
    () => logger.startTrace("useNotificationBell_v4.0"),
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("[NotificationBell] Hook montado.", { traceId });
    const fetchNotifications = async () => {
      setIsLoading(true);
      const result = await getNotificationsAction();
      if (result.success) {
        setNotifications(result.data);
        const newUnreadCount = result.data.filter((n) => !n.is_read).length;
        setUnreadCount(newUnreadCount);
      } else {
        logger.error("[NotificationBell] Fallo al obtener notificaciones.", {
          error: result.error,
          traceId,
        });
      }
      setIsLoading(false);
    };
    fetchNotifications();
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const handleOpenChange = useCallback(
    (openState: boolean) => {
      const actionTraceId = logger.startTrace(
        `notificationBell.onOpenChange:${openState}`
      );
      setIsOpen(openState);
      logger.traceEvent(
        actionTraceId,
        `Panel ${openState ? "abierto" : "cerrado"}.`
      );

      if (openState && unreadCount > 0) {
        const currentUnread = unreadCount;
        setUnreadCount(0); // Actualización optimista

        markNotificationsAsReadAction().then((result) => {
          if (!result.success) {
            logger.error(
              "[Guardián] Fallo al marcar como leídas. Revirtiendo UI.",
              { error: result.error, traceId: actionTraceId }
            );
            setUnreadCount(currentUnread); // Revertir
          }
          logger.endTrace(actionTraceId);
        });
      } else {
        logger.endTrace(actionTraceId);
      }
    },
    [unreadCount]
  ); // 'traceId' ha sido eliminado de las dependencias.

  return { isOpen, handleOpenChange, notifications, unreadCount, isLoading };
}
