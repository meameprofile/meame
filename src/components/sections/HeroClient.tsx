// RUTA: src/components/sections/HeroClient.tsx
/**
 * @file HeroClient.tsx
 * @description Componente de cliente puro ("Client Core") para la sección Hero.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";

interface HeroClientProps extends SectionProps<"hero"> {
  backgroundImageUrl: string;
  isFocused?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.6 },
  },
};

export const HeroClient = forwardRef<HTMLElement, HeroClientProps>(
  ({ content, backgroundImageUrl, isFocused }, ref) => {
    logger.info("[HeroClient] Renderizando v2.0 (Focus-Aware).");

    const { title, subtitle } = content;
    const titleWords = title.split(" ");

    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        id="hero"
        className={cn(
          "relative bg-background pt-8 pb-16 text-center overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 rounded-lg",
          isFocused &&
            "ring-2 ring-primary ring-offset-4 ring-offset-background"
        )}
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : "none",
        }}
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-black/50" />
        <Container className="relative z-10">
          <motion.h1
            id="hero-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-serif text-white drop-shadow-lg"
            aria-label={title}
            variants={titleContainerVariants}
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block"
                variants={wordVariants}
                style={{ marginRight: "0.25em" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md"
            variants={subtitleVariants}
          >
            {subtitle}
          </motion.p>
        </Container>
      </motion.section>
    );
  }
);
HeroClient.displayName = "HeroClient";
