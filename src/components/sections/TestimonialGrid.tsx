// RUTA: src/components/sections/TestimonialGrid.tsx
/**
 * @file TestimonialGrid.tsx
 * @description Sección de prueba social que muestra una cuadrícula de testimonios.
 * @version 5.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Testimonial } from "@/shared/lib/schemas/components/testimonial-grid.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface TestimonialGridProps extends SectionProps<"testimonialGrid"> {
  isFocused?: boolean;
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const TestimonialGrid = forwardRef<HTMLElement, TestimonialGridProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[TestimonialGrid] Renderizando v5.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a TestimonialGrid."
      );
      return (
        <DeveloperErrorDisplay
          context="TestimonialGrid"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { title, testimonials } = content;

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
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial: Testimonial) => (
              <TestimonialCard
                key={testimonial.author}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </motion.div>
        </Container>
      </section>
    );
  }
);
TestimonialGrid.displayName = "TestimonialGrid";
