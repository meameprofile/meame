// RUTA: src/components/features/analytics/CampaignsTable.tsx
/**
 * @file CampaignsTable.tsx
 * @description Orquestador de UI para la tabla de datos de campañas.
 * @version 2.0.0 (Locale Propagation)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { CampaignAnalyticsData } from "@/shared/lib/schemas/analytics/campaign-analytics.schema";
import type { CampaignsTableContentSchema } from "@/shared/lib/schemas/components/analytics/campaigns-table.schema";

import { getAnalyticsColumns } from "./CampaignsTable.columns";

type Content = z.infer<typeof CampaignsTableContentSchema>;

interface CampaignsTableProps {
  data: CampaignAnalyticsData[];
  content: Content;
  locale: Locale; // <-- Se añade la prop locale al contrato
}

export function CampaignsTable({ data, content, locale }: CampaignsTableProps) {
  logger.info("[CampaignsTable] Renderizando tabla de campañas (v2.0).");
  const columns = React.useMemo(
    () => getAnalyticsColumns(content, locale),
    [content, locale]
  ); // <-- Se pasa el locale
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {content.noResultsText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {content.previousButton}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {content.nextButton}
        </Button>
      </div>
    </div>
  );
}
