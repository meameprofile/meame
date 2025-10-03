// src/components/ui/PriceDisplay.tsx
/**
 * @file PriceDisplay.tsx
 * @description Componente atómico de UI para mostrar precios con formato.
 * @description_es Renderiza el precio original (tachado) y el precio con
 *               descuento, utilizando la API Intl.NumberFormat para un
 *               formato de moneda correcto según el locale.
 * @version 1.0.0
 * @author IA Ingeniera de Software Senior v2.0
 */
"use client";

import React from "react";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  locale: string;
  currency?: string;
  originalPriceLabel: string;
  discountedPriceLabel: string;
}

/**
 * @component PriceDisplay
 * @description Muestra los precios de la oferta.
 * @param {PriceDisplayProps} props Las propiedades del componente.
 * @returns {React.ReactElement} El elemento JSX que representa los precios.
 */
export function PriceDisplay({
  originalPrice,
  discountedPrice,
  locale,
  currency = "EUR", // Default a Euros, adecuado para el mercado italiano.
  originalPriceLabel,
  discountedPriceLabel,
}: PriceDisplayProps): React.ReactElement {
  console.log("[Observabilidad] Renderizando PriceDisplay");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="my-6 text-center">
      <div className="mb-2">
        <span className="text-sm text-muted-foreground">
          {originalPriceLabel}:{" "}
        </span>
        <span className="text-lg line-through text-muted-foreground">
          {formatCurrency(originalPrice)}
        </span>
      </div>
      <div>
        <span className="text-xl font-bold text-accent">
          {discountedPriceLabel}:{" "}
        </span>
        <span className="text-3xl font-bold text-accent animate-pulse">
          {formatCurrency(discountedPrice)}
        </span>
      </div>
    </div>
  );
}
// src/components/ui/PriceDisplay.tsx
