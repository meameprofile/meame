// RUTA: src/components/sections/TextSection.tsx
/**
 * @file TextSection.tsx
 * @description Motor de renderizado de contenido estructurado.
 * @version 4.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";
import type {
  ContentBlocks,
  ContentBlock,
} from "@/shared/lib/schemas/components/content-block.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface TextSectionProps {
  content: ContentBlocks;
  className?: string;
  spacing?: "default" | "compact" | "loose";
  prose?: boolean;
  isFocused?: boolean;
}

export const TextSection = forwardRef<HTMLElement, TextSectionProps>(
  (
    { content, className, spacing = "default", prose = true, isFocused },
    ref
  ) => {
    logger.info("[TextSection] Renderizando v4.0 (Focus-Aware).");

    if (!content) {
      logger.error("[Guardián] Prop 'content' no proporcionada a TextSection.");
      return (
        <DeveloperErrorDisplay
          context="TextSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const spacingClasses = {
      default: "py-16 sm:py-24",
      compact: "py-8 sm:py-12",
      loose: "py-24 sm:py-32",
    };

    const sectionClasses = cn(
      spacingClasses[spacing],
      className,
      isFocused && "ring-2 ring-primary"
    );
    const containerClasses = cn({
      "prose prose-invert lg:prose-xl mx-auto": prose,
    });

    return (
      <section ref={ref} className={sectionClasses}>
        <Container className={containerClasses}>
          {content.map((block: ContentBlock, index: number) => {
            if (block.type === "h2") {
              return <h2 key={index}>{block.text}</h2>;
            }
            return <p key={index}>{block.text}</p>;
          })}
        </Container>
      </section>
    );
  }
);
TextSection.displayName = "TextSection";
