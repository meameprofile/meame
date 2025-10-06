// RUTA: src/components/sections/FeaturesSection.tsx
/**
 * @file FeaturesSection.tsx
 * @description Componente de sección para mostrar una lista de características clave.
 * @version 3.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import { Container } from "@/components/ui/Container";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { FeatureItem } from "@/shared/lib/schemas/components/features-section.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface FeaturesSectionProps extends SectionProps<"featuresSection"> {
  isFocused?: boolean;
}

export const FeaturesSection = forwardRef<HTMLElement, FeaturesSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[FeaturesSection] Renderizando v3.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a FeaturesSection."
      );
      return (
        <DeveloperErrorDisplay
          context="FeaturesSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { eyebrow, title, subtitle, features } = content;

    return (
      <section
        ref={ref}
        id="features"
        className={cn(
          "py-24 sm:py-32 bg-background/50 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              {eyebrow}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature: FeatureItem) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <DynamicIcon
                        name={feature.icon}
                        className="h-6 w-6 text-primary-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    );
  }
);
FeaturesSection.displayName = "FeaturesSection";
