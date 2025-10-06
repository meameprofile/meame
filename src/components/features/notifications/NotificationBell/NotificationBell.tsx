// RUTA: src/components/features/notifications/NotificationBell/NotificationBell.tsx
"use client";
import React from "react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { useNotificationBell } from "@/shared/hooks/use-notification-bell";
import { NotificationBellTrigger, NotificationBellContent } from "./components";
import type { z } from "zod";
import type { NotificationBellContentSchema } from "@/shared/lib/schemas/components/notifications.schema";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
type Content = z.infer<typeof NotificationBellContentSchema>;

interface NotificationBellProps {
  content: Content;
}

export function NotificationBell({ content }: NotificationBellProps) {
  logger.info("[NotificationBell] Renderizando orquestador v5.1.");

  const { isOpen, handleOpenChange, notifications, unreadCount, isLoading } =
    useNotificationBell();

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
