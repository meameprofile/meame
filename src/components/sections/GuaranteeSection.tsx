// RUTA: src/components/sections/GuaranteeSection.tsx
/**
 * @file GuaranteeSection.tsx
 * @description Muestra una marquesina con los sellos de calidad y confianza.
 * @version 6.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Seal } from "@/shared/lib/schemas/components/guarantee-section.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface GuaranteeSectionProps extends SectionProps<"guaranteeSection"> {
  isFocused?: boolean;
}

export const GuaranteeSection = forwardRef<HTMLElement, GuaranteeSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[GuaranteeSection] Renderizando v6.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a GuaranteeSection."
      );
      return (
        <DeveloperErrorDisplay
          context="GuaranteeSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { title, seals } = content;

    return (
      <section
        ref={ref}
        className={cn(
          "py-16 sm:py-24 bg-background transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 sm:text-4xl">
            {title}
          </h2>
          <Marquee
            gradient={true}
            gradientColor="hsl(var(--background))"
            gradientWidth={100}
            speed={50}
            autoFill={true}
            pauseOnHover={true}
          >
            {seals.map((seal: Seal) => (
              <div
                key={seal.imageAlt}
                className="mx-12 flex items-center justify-center"
              >
                <Image
                  src={seal.imageUrl}
                  alt={seal.imageAlt}
                  width={120}
                  height={120}
                  className="h-24 w-24 md:h-32 md:w-32 object-contain"
                />
              </div>
            ))}
          </Marquee>
        </Container>
      </section>
    );
  }
);
GuaranteeSection.displayName = "GuaranteeSection";
