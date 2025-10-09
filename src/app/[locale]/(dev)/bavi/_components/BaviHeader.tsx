// RUTA: src/app/[locale]/(dev)/bavi/_components/BaviHeader.tsx
/**
 * @file BaviHeader.tsx
 * @description Componente de presentación para la cabecera del explorador de activos BAVI.
 *              Forjado con un contrato de API de élite, internacionalización completa y
 *              observabilidad hiper-granular para el rastreo de intenciones de usuario.
 * @version 4.0.0 (Holistic & Fully Observable)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";
import type { BaviHeaderContentSchema } from "@/shared/lib/schemas/pages/dev/bavi/bavi-header.i18n.schema";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

type SesaOptions = z.infer<typeof PromptCreatorContentSchema>["sesaOptions"];
type Content = z.infer<typeof BaviHeaderContentSchema>;

interface BaviHeaderProps {
  searchQuery: string;
  activeFilters: Partial<RaZPromptsSesaTags>;
  onSearchChange: (value: string) => void;
  onFilterChange: (category: keyof RaZPromptsSesaTags, value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onUploadClick: () => void;
  onRefreshClick: () => void;
  sesaOptions: SesaOptions;
  isPending: boolean;
  content: Content;
}

export function BaviHeader({
  searchQuery,
  activeFilters,
  onSearchChange,
  onFilterChange,
  onSearchSubmit,
  onUploadClick,
  onRefreshClick,
  sesaOptions,
  isPending,
  content,
}: BaviHeaderProps) {
  const traceId = useMemo(
    () => logger.startTrace("BaviHeader_Lifecycle_v4.0"),
    []
  );

  useEffect(() => {
    logger.info("[BaviHeader] Componente montado y listo.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Assets</h1>
      <div className="ml-auto flex w-full md:w-auto items-center gap-2">
        <form
          onSubmit={(e) => {
            logger.traceEvent(traceId, "Intención de Usuario: Enviar Búsqueda");
            onSearchSubmit(e);
          }}
          className="flex-1 md:w-64"
        >
          <div className="relative">
            <DynamicIcon
              name="Search"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 sm:w-full"
              disabled={isPending}
            />
          </div>
        </form>
        <Select
          value={activeFilters.ai || "all"}
          onValueChange={(value) => {
            logger.traceEvent(
              traceId,
              "Intención de Usuario: Cambiar Filtro IA",
              { value }
            );
            onFilterChange("ai", value);
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={content.filterByAILabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{content.allAIsOption}</SelectItem>
            {sesaOptions.ai.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            logger.traceEvent(traceId, "Intención de Usuario: Refrescar Datos");
            onRefreshClick();
          }}
          variant="outline"
          size="icon"
          disabled={isPending}
          aria-label="Refrescar"
        >
          <DynamicIcon name="RefreshCw" className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            logger.traceEvent(
              traceId,
              "Intención de Usuario: Abrir Modal de Subida"
            );
            onUploadClick();
          }}
          disabled={isPending}
        >
          <DynamicIcon name="Upload" className="h-4 w-4 mr-2" />
          {content.uploadButton}
        </Button>
      </div>
    </div>
  );
}
