// RUTA: components/features/product-variant-selector/VariantSelector.tsx
/**
 * @file VariantSelector.tsx
 * @description Componente de presentación puro para la UI del selector de variantes.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { cn } from "@/shared/lib/utils/cn";
import { useVariantSelector } from "./product-variant.context";
import { Button } from "@/components/ui/Button";

export function VariantSelector(): React.ReactElement {
  const { options, variants, selectedOptions, updateOption } =
    useVariantSelector();

  return (
    <div>
      {options.map((option) => (
        <dl className="mb-8" key={option.id}>
          <dt className="mb-4 text-sm uppercase tracking-wide">
            {option.name}
          </dt>
          <dd className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const newParams = new URLSearchParams(selectedOptions.toString());
              newParams.set(optionNameLowerCase, value);

              const isAvailableForSale = variants.some((variant) => {
                return (
                  variant.selectedOptions.every((selected) => {
                    return (
                      newParams.get(selected.name.toLowerCase()) ===
                      selected.value
                    );
                  }) && variant.availableForSale
                );
              });

              const isActive =
                selectedOptions.get(optionNameLowerCase) === value;

              return (
                <Button
                  key={value}
                  onClick={() => updateOption(option.name, value)}
                  disabled={!isAvailableForSale}
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    !isAvailableForSale &&
                      "relative text-muted-foreground before:absolute before:inset-x-0 before:h-px before:-rotate-45 before:bg-muted-foreground before:transition-transform"
                  )}
                >
                  {value}
                </Button>
              );
            })}
          </dd>
        </dl>
      ))}
    </div>
  );
}
