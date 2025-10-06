// RUTA: src/components/sections/ProductGrid.tsx
/**
 * @file ProductGrid.tsx
 * @description Cuadrícula de productos de lujo, ahora como un orquestador
 *              puro que cumple el contrato soberano de secciones.
 * @version 6.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface ProductGridProps extends SectionProps<"storePage"> {
  products: Product[];
  isFocused?: boolean;
}

export const ProductGrid = forwardRef<HTMLElement, ProductGridProps>(
  ({ products, locale, content, isFocused }, ref) => {
    logger.info("[ProductGrid] Renderizando v6.0 (Focus-Aware).");

    if (!content) {
      logger.error("[Guardián] Prop 'content' no proporcionada a ProductGrid.");
      return (
        <DeveloperErrorDisplay
          context="ProductGrid"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    const gridVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.main
        ref={ref as React.Ref<HTMLDivElement>} // `main` es un HTMLElement
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-300",
          isFocused && "ring-2 ring-primary rounded-lg"
        )}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={cardVariants}>
            <ProductCard product={product} locale={locale} content={content} />
          </motion.div>
        ))}
      </motion.main>
    );
  }
);
ProductGrid.displayName = "ProductGrid";
