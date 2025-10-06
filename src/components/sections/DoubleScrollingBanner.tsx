// RUTA: src/components/sections/DoubleScrollingBanner.tsx
/**
 * @file DoubleScrollingBanner.tsx
 * @description Sección de prueba social con dos marquesinas animadas.
 * @version 4.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type {
  TestimonialItem as Testimonial,
  LogoItem as Logo,
} from "@/shared/lib/schemas/components/double-scrolling-banner.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface DoubleScrollingBannerProps
  extends SectionProps<"doubleScrollingBanner"> {
  isFocused?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <DynamicIcon
          key={i}
          name="Star"
          className={`h-4 w-4 ${
            i < rating ? "text-accent" : "text-muted-foreground/50"
          }`}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ imageSrc, altText, name, rating }: Testimonial) => (
  <div className="mx-4 flex w-64 flex-col items-center justify-center rounded-lg bg-background p-4 shadow-md border border-white/10">
    <Image
      src={imageSrc}
      alt={altText}
      width={80}
      height={80}
      className="h-20 w-20 rounded-full object-cover"
    />
    <p className="mt-3 text-center font-bold text-foreground">{name}</p>
    <div className="mt-1">
      <StarRating rating={rating} />
    </div>
  </div>
);

export const DoubleScrollingBanner = forwardRef<
  HTMLElement,
  DoubleScrollingBannerProps
>(({ content, isFocused }, ref) => {
  logger.info("[DoubleScrollingBanner] Renderizando v4.0 (Focus-Aware).");

  if (!content) {
    logger.error(
      "[Guardián] Prop 'content' no proporcionada a DoubleScrollingBanner."
    );
    return (
      <DeveloperErrorDisplay
        context="DoubleScrollingBanner"
        errorMessage="Contrato de UI violado: La prop 'content' es requerida."
      />
    );
  }

  const { testimonials, logos } = content;

  return (
    <section
      ref={ref}
      className={cn(
        "w-full bg-background/50 py-12 overflow-x-hidden transition-all duration-300",
        isFocused && "ring-2 ring-primary"
      )}
    >
      <Marquee speed={40} autoFill={true} pauseOnHover={true} gradient={false}>
        {testimonials.map((testimonial: Testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </Marquee>
      <div className="h-8" />
      <Marquee
        direction="right"
        speed={30}
        autoFill={true}
        pauseOnHover={true}
        gradient={false}
      >
        {logos.map((logo: Logo) => (
          <div
            key={logo.altText}
            className="mx-12 flex items-center justify-center"
          >
            <Image
              src={logo.imageSrc}
              alt={logo.altText}
              width={140}
              height={48}
              className="h-12 w-auto object-contain grayscale opacity-75 transition-all duration-300 hover:opacity-100"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
});
DoubleScrollingBanner.displayName = "DoubleScrollingBanner";
