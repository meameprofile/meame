// RUTA: src/shared/hooks/use-product-filters.ts
/**
 * @file use-product-filters.ts
 * @description Hook soberano para gestionar el estado y la lógica de filtrado de productos.
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import { logger } from "@/shared/lib/logging";

export interface ProductFiltersState {
  searchQuery: string;
  selectedTags: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export const useProductFilters = (allProducts: Product[]) => {
  const [filters, setFilters] = useState<ProductFiltersState>({
    searchQuery: "",
    selectedTags: [],
    priceRange: [0, 200],
    inStockOnly: false,
  });

  const filteredProducts = useMemo(() => {
    const traceId = logger.startTrace("useProductFilters.recalculate");
    logger.trace("[ProductFilters] Recalculando productos filtrados...", {
      filters,
      traceId,
    });

    const result = allProducts.filter((product) => {
      if (
        filters.searchQuery &&
        !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;
      if (filters.selectedTags.length > 0) {
        const productTags = [
          product.categorization.primary,
          ...(product.categorization.secondary || []),
        ];
        if (!filters.selectedTags.every((tag) => productTags.includes(tag)))
          return false;
      }
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      )
        return false;
      if (filters.inStockOnly && product.inventory.available <= 0) return false;
      return true;
    });

    logger.success(
      `[ProductFilters] Recálculo completado. ${result.length} de ${allProducts.length} productos coinciden.`,
      { traceId }
    );
    logger.endTrace(traceId);
    return result;
  }, [allProducts, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
  };
};
