// RUTA: src/components/features/analytics/CampaignsTable.columns.tsx
/**
 * @file CampaignsTable.columns.tsx
 * @description SSoT para las definiciones de las columnas de la tabla de analíticas.
 *              v6.0.0 (Icon SSoT Compliance): Se corrige el nombre del icono de
 *              acciones a 'Ellipsis' para alinearse con el manifiesto de iconos
 *              soberano (lucide-icon-names.ts), resolviendo un error de tipo TS2820.
 * @version 6.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui";
import type { CampaignAnalyticsData } from "@/shared/lib/schemas/analytics/campaign-analytics.schema";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { logger } from "@/shared/lib/logging";

interface ActionsCellProps {
  row: Row<CampaignAnalyticsData>;
  content: {
    actionsLabel: string;
    viewDetailsLabel: string;
  };
}

const ActionsCell = ({ row, content }: ActionsCellProps) => {
  logger.trace("[ActionsCell] Renderizando celda de acciones v6.0.");
  const campaign = row.original;
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          {/* --- [INICIO DE REFACTORIZACIÓN DE SSoT] --- */}
          {/* Se reemplaza "MoreHorizontal" por el icono canónico "Ellipsis". */}
          <DynamicIcon name="Ellipsis" className="h-4 w-4" />
          {/* --- [FIN DE REFACTORIZACIÓN DE SSoT] --- */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{content.actionsLabel}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/analytics/${campaign.variantId}`}>
            {content.viewDetailsLabel}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getAnalyticsColumns = (
  content: ActionsCellProps["content"]
): ColumnDef<CampaignAnalyticsData>[] => [
  {
    accessorKey: "variantName",
    header: "Variante",
  },
  {
    accessorKey: "summary.totalVisitors",
    header: "Visitantes",
  },
  {
    accessorKey: "summary.conversions",
    header: "Conversiones",
  },
  {
    accessorKey: "summary.bounceRate",
    header: "Tasa de Rebote",
    cell: ({ row }) => `${row.original.summary.bounceRate}%`,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} content={content} />,
  },
];
