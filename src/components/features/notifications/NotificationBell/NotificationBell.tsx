// RUTA: src/components/features/notifications/NotificationBell/NotificationBell.tsx
/**
 * @file NotificationBell.tsx
 * @description Orquestador de la feature NotificationBell.
 * @version 5.0.0 (React Hooks Contract Restoration)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useNotificationBell } from "@/shared/hooks/use-notification-bell";
import { NotificationBellTrigger, NotificationBellContent } from "./components";
import type { z } from "zod";
import type { NotificationBellContentSchema } from "@/shared/lib/schemas/components/notifications.schema";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Content = z.infer<typeof NotificationBellContentSchema>;

interface NotificationBellProps {
  content: Content;
}

export function NotificationBell({ content }: NotificationBellProps) {
  logger.info("[NotificationBell] Renderizando orquestador v5.0.");

  // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: CUMPLIMIENTO DE REGLAS DE HOOKS] ---
  // La llamada al hook ahora es incondicional y se encuentra en el nivel superior.
  const { isOpen, handleOpenChange, notifications, unreadCount, isLoading } =
    useNotificationBell();
  // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

  // El Guardián de Resiliencia se ejecuta DESPUÉS de la llamada a los hooks.
  if (!content) {
    const errorMessage =
      "Contrato de UI violado: La prop 'content' para NotificationBell es nula o indefinida.";
    logger.error(`[Guardián de Resiliencia][NotificationBell] ${errorMessage}`);

    if (process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="NotificationBell"
          errorMessage={errorMessage}
        />
      );
    }
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <div
        onMouseEnter={() => handleOpenChange(true)}
        onMouseLeave={() => handleOpenChange(false)}
      >
        <NotificationBellTrigger
          unreadCount={unreadCount}
          label={content.notificationsLabel}
        />
        <NotificationBellContent
          isLoading={isLoading}
          notifications={notifications}
          content={content}
        />
      </div>
    </DropdownMenu>
  );
}
