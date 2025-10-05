// RUTA: src/components/features/analytics/CampaignsTable.columns.tsx
/**
 * @file CampaignsTable.columns.tsx
 * @description SSoT para la definición de columnas de la tabla de analíticas.
 *              v2.1.0 (SSoT Icon Alignment): Se reemplaza el icono faltante por
 *              un sustituto semántico ('Ellipsis') garantizado por la SSoT de iconos,
 *              resolviendo el error de build TS2820.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { CampaignAnalyticsData } from "@/shared/lib/schemas/analytics/campaign-analytics.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { z } from "zod";
import type { CampaignsTableContentSchema } from "@/shared/lib/schemas/components/analytics/campaigns-table.schema";
import { logger } from "@/shared/lib/logging";

type Content = z.infer<typeof CampaignsTableContentSchema>;

const ActionsCell = ({
  row,
  content,
}: {
  row: Row<CampaignAnalyticsData>;
  content: Content;
}) => {
  const pathname = usePathname();
  const variantId = row.original.variantId;

  logger.trace(
    `[ActionsCell] Renderizando acciones para la variante: ${variantId}`
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          {/* --- [INICIO DE CORRECCIÓN DE SSoT] --- */}
          {/* Se reemplaza 'MoreHorizontal' por 'Ellipsis', que es el sustituto semántico y existe en tu SSoT. */}
          <DynamicIcon name="Ellipsis" className="h-4 w-4" />
          {/* --- [FIN DE CORRECCIÓN DE SSoT] --- */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{content.actionsLabel}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`${pathname}/${variantId}`}>
            {content.viewDetailsLabel}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getAnalyticsColumns = (
  content: Content
): ColumnDef<CampaignAnalyticsData>[] => [
  {
    accessorKey: "variantName",
    header: content.headerVariant,
  },
  {
    accessorKey: "summary.totalVisitors",
    header: content.headerVisitors,
  },
  {
    accessorKey: "summary.conversions",
    header: content.headerConversions,
  },
  {
    accessorKey: "summary.bounceRate",
    header: content.headerBounceRate,
    cell: ({ row }) => `${row.original.summary.bounceRate}%`,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} content={content} />,
  },
];
