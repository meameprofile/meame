// app/[locale]/(dev)/raz-prompts/_components/VaultPagination.tsx
/**
 * @file VaultPagination.tsx
 * @description Componente de presentación puro para los controles de paginación.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type VaultContent = NonNullable<Dictionary["promptVault"]>;

interface VaultPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending: boolean;
  content: VaultContent;
}

export function VaultPagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending,
  content,
}: VaultPaginationProps): React.ReactElement | null {
  logger.info("[Observabilidad] Renderizando VaultPagination");

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button
        variant="outline"
        disabled={currentPage === 1 || isPending}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <DynamicIcon name="ChevronLeft" className="h-4 w-4 mr-2" />
        {content.previousPageButton}
      </Button>
      <span className="flex items-center text-sm font-medium">
        {content.pageInfo
          .replace("{{currentPage}}", String(currentPage))
          .replace("{{totalPages}}", String(totalPages))}
      </span>
      <Button
        variant="outline"
        disabled={currentPage === totalPages || isPending}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {content.nextPageButton}
        <DynamicIcon name="ChevronRight" className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
// app/[locale]/(dev)/raz-prompts/_components/VaultPagination.tsx
