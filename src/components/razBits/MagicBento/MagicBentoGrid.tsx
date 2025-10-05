// APARATO ÚNICO: CUADRÍCULA DE BENTO NAVEGABLE (NIVELACIÓN DEFINITIVA)
// RUTA: src/components/razBits/MagicBento/MagicBentoGrid.tsx

/**
 * @file MagicBentoGrid.tsx
 * @description Componente de trabajo de presentación puro para la cuadrícula MagicBento,
 *              ahora con capacidad de navegación integrada y cumplimiento de todos los pilares de calidad.
 * @version 2.0.0 (Navigable & Holistically Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useBentoGridInteraction } from "@/components/razBits/MagicBento/use-bento-grid-interaction";
import { BentoCard } from "./BentoCard";
import {
  type BentoCardData,
  type MagicBentoConfigSchema,
} from "./magic-bento.schema";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";

// Pilar II: Contratos de Tipo Estrictos
type BentoConfig = z.infer<typeof MagicBentoConfigSchema>;

interface MagicBentoGridProps {
  cards: BentoCardData[];
  config: BentoConfig;
  className?: string;
}

export function MagicBentoGrid({
  cards,
  config,
  className,
}: MagicBentoGridProps): React.ReactElement {
  // Pilar III: Observabilidad
  logger.trace(
    "[MagicBentoGrid] Renderizando componente de presentación puro v2.0."
  );
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Pilar I: Lógica Desacoplada a un Hook
  const { initializeCardInteractions } = useBentoGridInteraction(
    gridRef,
    config
  );

  return (
    <div
      ref={gridRef}
      className={twMerge(
        `bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] gap-4 max-w-7xl mx-auto p-4`,
        className
      )}
      // Pilar V: Theming Semántico
      style={
        {
          "--glow-color-rgb": `var(--${config.glowColor}-rgb)`,
        } as React.CSSProperties
      }
    >
      {cards.map((card: BentoCardData, index: number) => {
        const cardComponent = (
          <BentoCard
            key={card.title}
            card={card}
            cardRef={initializeCardInteractions}
            textAutoHide={config.textAutoHide}
            className={twMerge(
              // Lógica de layout para tarjetas destacadas
              index === 0 && "lg:col-span-2 lg:row-span-2",
              index === 3 && "lg:col-span-2"
            )}
          />
        );

        // Pilar VII: Adherencia Arquitectónica (Navegación)
        // Si la tarjeta tiene un href, la envolvemos en un Link de Next.js.
        if (card.href) {
          return (
            <Link href={card.href} key={card.title} className="contents">
              {cardComponent}
            </Link>
          );
        }

        return cardComponent;
      })}
    </div>
  );
}
