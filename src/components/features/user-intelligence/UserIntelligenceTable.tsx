// RUTA: src/components/features/user-intelligence/UserIntelligenceTable.tsx
/**
 * @file UserIntelligenceTable.tsx
 * @description Orquestador de UI para la tabla de Inteligencia de Usuarios.
 * @version 2.1.0 (SSoT Path Restoration)
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
import type { ProfiledUser } from "@/shared/lib/actions/user-intelligence/user-intelligence.contracts";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { UserIntelligenceContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema";

import { getUserIntelligenceColumns } from "./UserIntelligenceTable.columns";

type Content = z.infer<typeof UserIntelligenceContentSchema>;

interface UserIntelligenceTableProps {
  data: ProfiledUser[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  content: Content;
  locale: Locale;
}

export function UserIntelligenceTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  content,
  locale,
}: UserIntelligenceTableProps) {
  logger.info("[UserIntelligenceTable] Renderizando tabla de perfiles (v2.1).");

  const columns = React.useMemo(
    () => getUserIntelligenceColumns(content, locale),
    [content, locale]
  );

  const pageCount = Math.ceil(total / limit);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
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
                <TableRow key={row.original.sessionId}>
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
                  <p className="font-semibold">{content.emptyStateTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {content.emptyStateDescription}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total de {total} perfiles.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            {content.pagination.previous}
          </Button>
          <span>
            {content.pagination.pageInfo
              .replace("{{currentPage}}", String(page))
              .replace("{{totalPages}}", String(pageCount))}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            {content.pagination.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
