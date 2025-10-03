// RUTA: src/components/sections/ProductFilters.tsx
/**
 * @file ProductFilters.tsx
 * @description Barra lateral de filtros interactiva para la Tienda.
 * @version 5.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import type { z } from "zod";
import type { StorePageLocaleSchema } from "@/shared/lib/schemas/pages/store-page.schema";
import { logger } from "@/shared/lib/logging";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import type { ProductFiltersState } from "@/shared/hooks/use-product-filters";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

type FilterData = NonNullable<
  z.infer<typeof StorePageLocaleSchema>["storePage"]
>["filters"];

interface ProductFiltersProps {
  filtersContent: FilterData;
  allTags: string[];
  filtersState: ProductFiltersState;
  onFilterChange: React.Dispatch<React.SetStateAction<ProductFiltersState>>;
}

export function ProductFilters({
  filtersContent,
  allTags,
  filtersState,
  onFilterChange,
}: ProductFiltersProps): React.ReactElement {
  logger.info("[ProductFilters] Renderizando v5.0 (Elite).");

  if (!filtersContent) {
    logger.error(
      "[Guardián] Prop 'filtersContent' no proporcionada a ProductFilters."
    );
    return (
      <DeveloperErrorDisplay
        context="ProductFilters"
        errorMessage="Contrato de UI violado: La prop 'filtersContent' es requerida."
      />
    );
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    onFilterChange((prev: ProductFiltersState) => ({
      ...prev,
      selectedTags: checked
        ? [...prev.selectedTags, tag]
        : prev.selectedTags.filter((t: string) => t !== tag),
    }));
  };

  return (
    <aside className="lg:col-span-1 p-6 bg-card rounded-lg h-fit border border-border shadow-sm sticky top-24">
      <div className="space-y-8">
        <div>
          <Label
            htmlFor="search"
            className="text-lg font-bold text-primary mb-2 block"
          >
            {filtersContent.searchLabel}
          </Label>
          <Input
            id="search"
            placeholder={filtersContent.searchPlaceholder}
            value={filtersState.searchQuery}
            onChange={(e) =>
              onFilterChange((prev: ProductFiltersState) => ({
                ...prev,
                searchQuery: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            {filtersContent.tagsTitle}
          </h3>
          <div className="space-y-2">
            {allTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={filtersState.selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                />
                <Label
                  htmlFor={`tag-${tag}`}
                  className="text-sm font-medium leading-none capitalize cursor-pointer"
                >
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            {filtersContent.priceTitle}
          </h3>
          <Slider
            value={[filtersState.priceRange[1]]}
            max={200}
            step={5}
            onValueChange={([value]) =>
              onFilterChange((prev: ProductFiltersState) => ({
                ...prev,
                priceRange: [prev.priceRange[0], value],
              }))
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>€{filtersState.priceRange[0]}</span>
            <span>€{filtersState.priceRange[1]}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <h3 className="text-lg font-bold text-primary">
            {filtersContent.stockTitle}
          </h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="stock-switch"
              checked={filtersState.inStockOnly}
              onCheckedChange={(checked) =>
                onFilterChange((prev: ProductFiltersState) => ({
                  ...prev,
                  inStockOnly: checked,
                }))
              }
            />
            <Label htmlFor="stock-switch" className="text-sm cursor-pointer">
              {filtersContent.inStockLabel}
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
