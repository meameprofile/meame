// RUTA: src/components/features/analytics/CampaignsTable.columns.tsx
/**
 * @file CampaignsTable.columns.tsx
 * @description SSoT para la definición de columnas de la tabla de analíticas.
 *              v3.0.0 (Sovereign Routing Compliance): Refactorizado para consumir
 *              la SSoT de enrutamiento 'navigation.ts', resolviendo un error
 *              crítico de 'dynamic href' en el App Router.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
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
import { routes } from "@/shared/lib/navigation";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

type Content = z.infer<typeof CampaignsTableContentSchema>;

const ActionsCell = ({
  row,
  content,
  locale,
}: {
  row: Row<CampaignAnalyticsData>;
  content: Content;
  locale: Locale;
}) => {
  const variantId = row.original.variantId;
  logger.trace(
    `[ActionsCell] Renderizando acciones para la variante: ${variantId}`
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <DynamicIcon name="Ellipsis" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{content.actionsLabel}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          {/* --- [INICIO DE CORRECCIÓN SOBERANA] --- */}
          <Link href={routes.analyticsByVariant.path({ locale, variantId })}>
            {content.viewDetailsLabel}
          </Link>
          {/* --- [FIN DE CORRECCIÓN SOBERANA] --- */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getAnalyticsColumns = (
  content: Content,
  locale: Locale
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
    cell: ({ row }) => (
      <ActionsCell row={row} content={content} locale={locale} />
    ),
  },
];
