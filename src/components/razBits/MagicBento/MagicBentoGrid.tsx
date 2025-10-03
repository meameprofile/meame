// RUTA: src/components/razBits/MagicBento/MagicBentoGrid.tsx
/**
 * @file MagicBentoGrid.tsx
 * @description Componente de trabajo de presentación puro para la cuadrícula MagicBento.
 *              Este aparato es el responsable de renderizar la UI y de invocar
 *              el hook de interacción, garantizando el cumplimiento de las Reglas de los Hooks.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useBentoGridInteraction } from "@/components/razBits/MagicBento/use-bento-grid-interaction";
import { BentoCard } from "./BentoCard";
import {
  type BentoCardData,
  type MagicBentoConfigSchema,
} from "./magic-bento.schema";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";

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
  logger.trace("[MagicBentoGrid] Renderizando componente de trabajo.");
  const gridRef = useRef<HTMLDivElement | null>(null);

  // El hook ahora se llama incondicionalmente en el nivel superior del componente.
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
      style={
        {
          "--glow-color-rgb": `var(--${config.glowColor}-rgb)`,
        } as React.CSSProperties
      }
    >
      {cards.map((card: BentoCardData, index: number) => (
        <BentoCard
          key={card.title}
          card={card}
          cardRef={initializeCardInteractions}
          textAutoHide={config.textAutoHide}
          className={twMerge(
            index === 2 && "lg:col-span-2 lg:row-span-2",
            index === 3 && "lg:col-span-2"
          )}
        />
      ))}
    </div>
  );
}
// RUTA: src/components/razBits/MagicBento/MagicBentoGrid.tsx
