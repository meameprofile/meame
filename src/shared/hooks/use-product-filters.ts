// shared/hooks/use-product-filters.ts
/**
 * @file use-product-filters.ts
 * @description Hook soberano para gestionar el estado y la lógica de filtrado de productos.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
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
    priceRange: [0, 200], // Rango de precios por defecto
    inStockOnly: false,
  });

  const filteredProducts = useMemo(() => {
    logger.trace("[useProductFilters] Recalculando productos filtrados...");
    return allProducts.filter((product) => {
      // Filtro de Búsqueda por Nombre
      if (
        filters.searchQuery &&
        !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filtro por Tags (debe tener todos los tags seleccionados)
      if (filters.selectedTags.length > 0) {
        const productTags = [
          product.categorization.primary,
          ...(product.categorization.secondary || []),
        ];
        if (!filters.selectedTags.every((tag) => productTags.includes(tag))) {
          return false;
        }
      }

      // Filtro por Rango de Precios
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Filtro por Disponibilidad de Stock
      if (filters.inStockOnly && product.inventory.available <= 0) {
        return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
  };
};
// shared/hooks/use-product-filters.ts
