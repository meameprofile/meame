// RUTA: src/components/sections/FaqAccordion.tsx
/**
 * @file FaqAccordion.tsx
 * @description Sección de Preguntas Frecuentes (FAQ), nivelada a un estándar de élite,
 *              consumiendo el sistema de Acordeón composicional y animado.
 * @version 8.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { FaqItem } from "@/shared/lib/schemas/components/faq-accordion.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface FaqAccordionProps extends SectionProps<"faqAccordion"> {
  isFocused?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const FaqAccordion = forwardRef<HTMLElement, FaqAccordionProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[FaqAccordion] Renderizando v8.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a FaqAccordion."
      );
      return (
        <DeveloperErrorDisplay
          context="FaqAccordion"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { title, faqs } = content;

    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        id="faq"
        className={cn(
          "py-24 sm:py-32 bg-muted/40 transition-all duration-300 rounded-lg",
          isFocused &&
            "ring-2 ring-primary ring-offset-4 ring-offset-background"
        )}
        aria-labelledby="faq-title"
      >
        <Container className="max-w-3xl">
          <h2
            id="faq-title"
            className="text-3xl font-bold text-center text-foreground mb-12 sm:text-4xl"
          >
            {title}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faqItem: FaqItem, index: number) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faqItem.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faqItem.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </motion.section>
    );
  }
);
FaqAccordion.displayName = "FaqAccordion";
