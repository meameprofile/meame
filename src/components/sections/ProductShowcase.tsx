// RUTA: src/components/sections/ProductShowcase.tsx
/**
 * @file ProductShowcase.tsx
 * @description Vitrina de productos, alineada con la arquitectura de élite.
 * @version 4.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Product } from "@/shared/lib/schemas/components/product-showcase.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface ProductShowcaseProps extends SectionProps<"productShowcase"> {
  isFocused?: boolean;
}

export const ProductShowcase = forwardRef<HTMLElement, ProductShowcaseProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[ProductShowcase] Renderizando v4.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a ProductShowcase."
      );
      return (
        <DeveloperErrorDisplay
          context="ProductShowcase"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const { title, products } = content;

    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    };

    return (
      <section
        ref={ref}
        className={cn(
          "py-16 sm:py-24 bg-background/95 transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 sm:text-4xl">
            {title}
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.15 }}
          >
            {products.map((product: Product) => (
              <motion.div
                key={product.name}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 text-center"
                variants={cardVariants}
              >
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-foreground/80">
                  {product.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    );
  }
);
ProductShowcase.displayName = "ProductShowcase";
