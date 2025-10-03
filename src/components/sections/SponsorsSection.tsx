// RUTA: src/components/sections/SponsorsSection.tsx
/**
 * @file SponsorsSection.tsx
 * @description Componente de sección para mostrar una cuadrícula de logos de patrocinadores.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import { Container } from "@/components/ui/Container";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { SponsorItem } from "@/shared/lib/schemas/components/sponsors-section.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface SponsorsSectionProps extends SectionProps<"sponsorsSection"> {
  isFocused?: boolean;
}

export const SponsorsSection = forwardRef<HTMLElement, SponsorsSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[SponsorsSection] Renderizando v2.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a SponsorsSection."
      );
      return (
        <DeveloperErrorDisplay
          context="SponsorsSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { title, sponsors } = content;

    return (
      <section
        ref={ref}
        id="sponsors"
        className={cn(
          "py-24 sm:py-32 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-foreground">
              {title}
            </h2>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-7">
              {sponsors.map((sponsor: SponsorItem) => (
                <div
                  key={sponsor.name}
                  className="col-span-2 flex justify-center lg:col-span-1"
                >
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <DynamicIcon name={sponsor.icon} size={24} />
                    <span className="font-semibold">{sponsor.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }
);
SponsorsSection.displayName = "SponsorsSection";
