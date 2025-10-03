// RUTA: src/components/features/commerce/AddToCartForm.tsx
/**
 * @file AddToCartForm.tsx
 * @description Componente de cliente atómico y de élite para añadir al carrito.
 *              v2.0.0 (Architectural Normalization): Refactorizado para usar
 *              `useTransition` en lugar de `useActionState`, alineándose con
 *              la arquitectura soberana del proyecto y resolviendo errores de build.
 * @version 2.0.0
 * @author L.I.A. Legacy
 */
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, DynamicIcon, Input, Label } from "@/components/ui";
import { addItem } from "@/shared/lib/actions/commerce/cart.actions";
import { logger } from "@/shared/lib/logging";

interface AddToCartFormProps {
  isAvailable: boolean;
  variantId: string | undefined;
  content: {
    addToCartButton: string;
    quantityLabel: string;
    outOfStockText: string;
  };
}

export function AddToCartForm({
  isAvailable,
  variantId,
  content,
}: AddToCartFormProps) {
  logger.trace("[AddToCartForm] Renderizando v2.0 (Normalized).");
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  if (!isAvailable) {
    return (
      <Button size="lg" className="w-full sm:w-auto flex-1" disabled>
        {content.outOfStockText}
      </Button>
    );
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addItem(undefined, formData);
      if (result) {
        // Asumiendo que el resultado es una clave de i18n para el error
        toast.error("Error", { description: result });
      } else {
        toast.success("Producto añadido al carrito.");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <input type="hidden" name="variantId" value={variantId} />
      <div className="flex items-center gap-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          {content.quantityLabel}
        </Label>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <DynamicIcon name="Minus" className="h-4 w-4" />
          </Button>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="h-9 w-16 text-center mx-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <DynamicIcon name="Plus" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto flex-1"
        disabled={isPending}
      >
        {isPending && (
          <DynamicIcon
            name="LoaderCircle"
            className="mr-2 h-4 w-4 animate-spin"
          />
        )}
        {content.addToCartButton}
      </Button>
    </form>
  );
}
