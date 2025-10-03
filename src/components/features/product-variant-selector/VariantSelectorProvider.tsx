// RUTA: components/features/product-variant-selector/VariantSelectorProvider.tsx
/**
 * @file VariantSelectorProvider.tsx
 * @description Proveedor de contexto "smart" que encapsula la lógica de
 *              selección de variantes y la sincronización con la URL.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VariantContext } from "./product-variant.context";
import type {
  ProductOption,
  ProductVariant,
} from "@/shared/lib/schemas/entities/product.schema";
import { logger } from "@/shared/lib/logging";

interface VariantSelectorProviderProps {
  children: React.ReactNode;
  options: ProductOption[];
  variants: ProductVariant[];
}

export function VariantSelectorProvider({
  children,
  options,
  variants,
}: VariantSelectorProviderProps) {
  logger.trace("[VariantSelectorProvider] Inicializando proveedor de estado.");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateOption = useCallback(
    (optionName: string, optionValue: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(optionName.toLowerCase(), optionValue);
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const contextValue = {
    selectedOptions: searchParams,
    options,
    variants,
    updateOption,
  };

  return (
    <VariantContext.Provider value={contextValue}>
      {children}
    </VariantContext.Provider>
  );
}
