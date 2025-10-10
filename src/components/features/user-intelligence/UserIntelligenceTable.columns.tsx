// RUTA: src/components/features/user-intelligence/UserIntelligenceTable.columns.tsx
/**
 * @file UserIntelligenceTable.columns.tsx
 * @description SSoT para la definición de columnas de la tabla de Inteligencia de Usuarios.
 * @version 3.0.0 (Architectural Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { routes } from "@/shared/lib/navigation";
import { logger } from "@/shared/lib/logging";
import type { UserIntelligenceContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema";
import type { z } from "zod";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { ProfiledUser } from "@/shared/lib/actions/user-intelligence/user-intelligence.contracts";

type Content = z.infer<typeof UserIntelligenceContentSchema>;

export const getUserIntelligenceColumns = (
  content: Content,
  locale: Locale
): ColumnDef<ProfiledUser>[] => {
  logger.trace(
    "[UserIntelligenceColumns] Generando definiciones de columnas (v3.0)..."
  );

  return [
    {
      accessorKey: "displayName",
      header: content.tableHeaders.user,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={row.original.avatarUrl ?? undefined}
              alt={row.original.displayName}
            />
            <AvatarFallback>
              <DynamicIcon
                name={
                  row.original.userType === "Registered" ? "UserRound" : "Ghost"
                }
              />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.displayName}</span>
        </div>
      ),
    },
    {
      accessorKey: "userType",
      header: content.tableHeaders.userType,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.userType === "Registered" ? "default" : "secondary"
          }
        >
          {content.userTypes[row.original.userType]}
        </Badge>
      ),
    },
    {
      accessorKey: "firstSeenAt",
      header: content.tableHeaders.firstSeen,
      cell: ({ row }) =>
        new Date(row.original.firstSeenAt).toLocaleDateString(locale),
    },
    {
      accessorKey: "lastSeenAt",
      header: content.tableHeaders.lastSeen,
      cell: ({ row }) =>
        new Date(row.original.lastSeenAt).toLocaleString(locale, {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      accessorKey: "totalEvents",
      header: content.tableHeaders.totalEvents,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right">{content.tableHeaders.actions}</div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <Button asChild variant="outline" size="sm">
            <Link
              href={routes.userIntelligenceDetail.path({
                locale,
                sessionId: row.original.sessionId,
              })}
            >
              <DynamicIcon name="LineChart" className="mr-2 h-4 w-4" />
              {content.viewProfileButton}
            </Link>
          </Button>
        </div>
      ),
    },
  ];
};
