// RUTA: src/components/sections/TestimonialCarouselSection.tsx
/**
 * @file TestimonialCarouselSection.tsx
 * @description Componente de sección para mostrar testimonios en un formato de carrusel interactivo.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Image from "next/image";
import React, { forwardRef } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { DynamicIcon } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import type { ReviewItem } from "@/shared/lib/schemas/components/testimonial-carousel-section.schema";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

interface TestimonialCarouselSectionProps
  extends SectionProps<"testimonialCarouselSection"> {
  isFocused?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <DynamicIcon
        key={i}
        name="Star"
        className="w-4 h-4"
        fill={i < rating ? "currentColor" : "none"}
      />
    ))}
  </div>
);

export const TestimonialCarouselSection = forwardRef<
  HTMLElement,
  TestimonialCarouselSectionProps
>(({ content, isFocused }, ref) => {
  logger.info("[TestimonialCarouselSection] Renderizando v2.0 (Focus-Aware).");

  if (!content) {
    logger.error(
      "[Guardián] Prop 'content' no proporcionada a TestimonialCarouselSection."
    );
    return (
      <DeveloperErrorDisplay
        context="TestimonialCarouselSection"
        errorMessage="Contrato de UI violado: La prop 'content' es requerida."
      />
    );
  }

  const { eyebrow, title, reviews } = content;

  return (
    <section
      ref={ref}
      id="testimonials-carousel"
      className={cn(
        "py-24 sm:py-32 transition-all duration-300",
        isFocused && "ring-2 ring-primary"
      )}
    >
      <Container className="text-center">
        <h2 className="text-lg text-primary mb-2 tracking-wider">{eyebrow}</h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-12">{title}</h3>
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {reviews.map((review: ReviewItem, index: number) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6">
                      <Image
                        src={review.image}
                        alt={`Avatar de ${review.name}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 mb-4 rounded-full"
                      />
                      <p className="text-muted-foreground text-md mb-4 h-24">
                        &quot;{review.comment}&quot;
                      </p>
                      <StarRating rating={review.rating} />
                      <cite className="mt-4 not-italic">
                        <span className="block font-semibold text-foreground">
                          {review.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {review.userName}
                        </span>
                      </cite>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </section>
  );
});
TestimonialCarouselSection.displayName = "TestimonialCarouselSection";
