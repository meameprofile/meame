// RUTA: components/features/product-variant-selector/product-variant.context.ts
/**
 * @file product-variant.context.ts
 * @description SSoT para el estado y las acciones del selector de variantes de producto.
 *              Define el contexto de React que gestionará la variante seleccionada.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { createContext, useContext } from "react";
import { logger } from "@/shared/lib/logging";
import type {
  ProductOption,
  ProductVariant,
} from "@/shared/lib/schemas/entities/product.schema";

export interface VariantContextState {
  selectedOptions: URLSearchParams;
  options: ProductOption[];
  variants: ProductVariant[];
  updateOption: (optionName: string, optionValue: string) => void;
}

export const VariantContext = createContext<VariantContextState | undefined>(
  undefined
);

export const useVariantSelector = (): VariantContextState => {
  const context = useContext(VariantContext);
  if (!context) {
    const errorMsg =
      "Error de Arquitectura: useVariantSelector debe ser usado dentro de un VariantSelectorProvider.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  return context;
};
