// RUTA: src/components/razBits/MagicBento/BentoCard.tsx
/**
 * @file BentoCard.tsx
 * @description Componente de presentación puro para una tarjeta individual
 *              dentro de la cuadrícula MagicBento.
 * @version 2.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

import { logger } from "@/shared/lib/logging";

import type { BentoCardData } from "./magic-bento.schema";

interface BentoCardProps {
  card: BentoCardData;
  cardRef: (node: HTMLDivElement | null) => void;
  className?: string;
  textAutoHide?: boolean;
}

export function BentoCard({
  card,
  cardRef,
  className,
  textAutoHide,
}: BentoCardProps): React.ReactElement {
  logger.trace(`[BentoCard] Renderizando tarjeta: ${card.title}`);

  return (
    <div
      ref={cardRef}
      className={twMerge(
        `group card flex flex-col justify-between relative aspect-square md:aspect-[4/3] min-h-[200px] p-5 rounded-3xl border border-white/10
         bg-black/30 backdrop-blur-sm overflow-hidden transition-all duration-300
         ease-in-out hover:-translate-y-1`,
        className
      )}
    >
      <div className="card-header flex justify-between items-center relative z-10">
        <span className="text-sm font-semibold text-primary">{card.label}</span>
      </div>
      <div className="card-content flex flex-col relative z-10 transition-opacity duration-300">
        <h3
          className={twMerge(
            "card-title font-bold text-lg text-foreground m-0 mb-1",
            textAutoHide && "group-hover:opacity-0"
          )}
        >
          {card.title}
        </h3>
        <p
          className={twMerge(
            "card-description text-sm text-muted-foreground leading-snug",
            textAutoHide && "group-hover:opacity-0"
          )}
        >
          {card.description}
        </p>
      </div>
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none
                   bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),_rgba(var(--glow-color-rgb),_calc(var(--glow-intensity)_*_0.25)),_transparent_40%)]
                   opacity-[var(--glow-intensity)] transition-opacity duration-300"
        style={
          {
            "--glow-x": "50%",
            "--glow-y": "50%",
            "--glow-intensity": 0,
            "--glow-radius": "400px",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
// RUTA: src/components/razBits/MagicBento/BentoCard.tsx
