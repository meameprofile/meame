// RUTA: src/components/sections/OrderSection.tsx
/**
 * @file OrderSection.tsx
 * @description Sección de conversión que consume el `OrderForm` soberano.
 *              v9.0.0 (Architectural Alignment & Elite Compliance): Refactorizado
 *              para consumir la SSoT canónica de `OrderForm` y cumplir con los 8 Pilares.
 * @version 9.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React, { forwardRef, useMemo } from "react";

import { OrderForm } from "@/components/features/commerce/OrderForm"; // <-- IMPORTACIÓN SOBERANA
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Container } from "@/components/ui/Container";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { logger } from "@/shared/lib/logging";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

interface OrderSectionProps extends SectionProps<"orderSection"> {
  isFocused?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const OrderSection = forwardRef<HTMLElement, OrderSectionProps>(
  ({ content, locale, isFocused }, ref) => {
    const traceId = useMemo(
      () => logger.startTrace("OrderSection_Lifecycle_v9.0"),
      []
    );
    logger.info("[OrderSection] Renderizando v9.0 (Aligned).", { traceId });

    // --- Guardián de Resiliencia de Contrato ---
    if (!content) {
      const errorMsg =
        "Contrato de UI violado: La prop 'content' para OrderSection es requerida.";
      logger.error(`[Guardián] ${errorMsg}`, { traceId });
      return (
        <section ref={ref}>
          <DeveloperErrorDisplay
            context="OrderSection"
            errorMessage={errorMsg}
          />
        </section>
      );
    }

    return (
      <motion.section
        ref={ref}
        id="order-form"
        className={cn(
          "py-16 sm:py-24 bg-secondary/20 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Container className="max-w-md">
          <div className="rounded-lg border border-white/20 bg-black/30 p-6 shadow-2xl backdrop-blur-md">
            <PriceDisplay
              originalPrice={content.originalPrice}
              discountedPrice={content.discountedPrice}
              locale={locale}
              originalPriceLabel={content.originalPriceLabel}
              discountedPriceLabel={content.discountedPriceLabel}
            />
            <OrderForm
              content={{
                nameInputLabel: content.nameInputLabel,
                nameInputPlaceholder: content.nameInputPlaceholder,
                phoneInputLabel: content.phoneInputLabel,
                phoneInputPlaceholder: content.phoneInputPlaceholder,
                submitButtonText: content.submitButtonText,
                submitButtonLoadingText: content.submitButtonLoadingText,
              }}
            />
          </div>
        </Container>
      </motion.section>
    );
  }
);
OrderSection.displayName = "OrderSection";
