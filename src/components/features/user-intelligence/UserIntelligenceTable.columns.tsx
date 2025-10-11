// RUTA: src/components/features/user-intelligence/UserIntelligenceTable.columns.tsx
/**
 * @file UserIntelligenceTable.columns.tsx
 * @description SSoT para la definición de columnas de la tabla de Inteligencia de Usuarios,
 *              ahora con integridad de ruta soberana, seguridad de tipos absoluta y
 *              observabilidad de élite.
 * @version 3.1.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ProfiledUser } from "@/shared/lib/actions/user-intelligence/user-intelligence.contracts";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { UserIntelligenceContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema";

type Content = z.infer<typeof UserIntelligenceContentSchema>;

// --- [INICIO] REFACTORIZACIÓN DE TIPO Y OBSERVABILIDAD ---
// Se extrae la celda de acciones a un componente puro para mayor claridad y se
// tipa explícitamente el parámetro 'row' para cumplir con el Pilar II.
const ActionsCell = ({
  row,
  content,
  locale,
}: {
  row: Row<ProfiledUser>;
  content: Content;
  locale: Locale;
}) => {
  logger.trace(
    `[ActionsCell] Renderizando acciones para la sesión: ${row.original.sessionId}`
  );
  return (
    <div className="text-right">
      <Button asChild variant="outline" size="sm">
        {/* --- [INICIO DE CORRECCIÓN DE RUTA SOBERANA] --- */}
        {/* Se utiliza la clave correcta 'userIntelligenceBySessionId' desde la SSoT de rutas. */}
        <Link
          href={routes.userIntelligenceBySessionId.path({
            locale,
            sessionId: row.original.sessionId,
          })}
        >
          {/* --- [FIN DE CORRECCIÓN DE RUTA SOBERANA] --- */}
          <DynamicIcon name="LineChart" className="mr-2 h-4 w-4" />
          {content.viewProfileButton}
        </Link>
      </Button>
    </div>
  );
};
// --- [FIN] REFACTORIZACIÓN DE TIPO Y OBSERVABILIDAD ---

export const getUserIntelligenceColumns = (
  content: Content,
  locale: Locale
): ColumnDef<ProfiledUser>[] => {
  logger.trace(
    "[UserIntelligenceColumns] Generando definiciones de columnas (v3.1)..."
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
        <ActionsCell row={row} content={content} locale={locale} />
      ),
    },
  ];
};
