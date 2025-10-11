// RUTA: src/components/features/raz-prompts/_components/VaultFilters.tsx
/**
 * @file VaultFilters.tsx
 * @description Componente de presentación puro para los controles de búsqueda y
 *              filtrado de la Bóveda de Prompts.
 * @version 2.0.0 (Holistic & API Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import {
  Input,
  Button,
  DynamicIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";

type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
type VaultContent = NonNullable<Dictionary["promptVault"]>;

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: CONTRATO DE API SOBERANO] ---
// Se define un contrato de props explícito y completo. Este componente ahora
// es 100% controlado por su padre, cumpliendo con el Principio de Responsabilidad Única.
interface VaultFiltersProps {
  searchQuery: string;
  activeFilters: Partial<RaZPromptsSesaTags>;
  onSearchChange: (value: string) => void;
  onFilterChange: (category: keyof RaZPromptsSesaTags, value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  content: VaultContent;
  sesaOptions: SesaOptions;
  isPending: boolean;
}
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export function VaultFilters({
  searchQuery,
  activeFilters,
  onSearchChange,
  onFilterChange,
  onSearchSubmit,
  content,
  sesaOptions,
  isPending,
}: VaultFiltersProps): React.ReactElement {
  logger.info(
    "[VaultFilters] Renderizando v2.0 (Holistic & API Contract Restoration)."
  );

  return (
    <div className="space-y-4">
      <form onSubmit={onSearchSubmit} className="flex gap-4">
        <Input
          placeholder={content.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-grow"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          <DynamicIcon name="Search" className="h-4 w-4 mr-2" />
          {content.searchButton}
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        <Select
          value={activeFilters.ai || "all"}
          onValueChange={(value) => onFilterChange("ai", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
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
        {/* Aquí se pueden añadir más filtros SESA de la misma manera */}
      </div>
    </div>
  );
}
