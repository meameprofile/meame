// RUTA: src/components/sections/ServicesSection.tsx
/**
 * @file ServicesSection.tsx
 * @description Componente de sección para mostrar una lista de servicios.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import type { ServiceItem } from "@/shared/lib/schemas/components/services-section.schema";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

interface ServicesSectionProps extends SectionProps<"servicesSection"> {
  isFocused?: boolean;
}

export const ServicesSection = forwardRef<HTMLElement, ServicesSectionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[ServicesSection] Renderizando v2.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a ServicesSection."
      );
      return (
        <DeveloperErrorDisplay
          context="ServicesSection"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { eyebrow, title, subtitle, proLabel, services } = content;

    return (
      <section
        ref={ref}
        id="services"
        className={cn(
          "py-24 sm:py-32 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container className="max-w-4xl">
          <div className="text-center">
            <h2 className="text-lg text-primary mb-2 tracking-wider">
              {eyebrow}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{title}</h3>
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-12">
            {services.map((service: ServiceItem) => (
              <Card key={service.title}>
                <CardHeader className="flex justify-between flex-row items-start pb-4">
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                  {service.isPro && (
                    <Badge variant="secondary" className="text-sm">
                      {proLabel}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    );
  }
);
ServicesSection.displayName = "ServicesSection";
