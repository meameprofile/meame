// RUTA: src/components/sections/IngredientAnalysis.tsx
/**
 * @file IngredientAnalysis.tsx
 * @description Sección de Análisis de Ingredientes, nivelada a un estándar de élite.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import type { Ingredient } from "@/shared/lib/schemas/components/ingredient-analysis.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface IngredientAnalysisProps extends SectionProps<"ingredientAnalysis"> {
  isFocused?: boolean;
}

export const IngredientAnalysis = forwardRef<
  HTMLElement,
  IngredientAnalysisProps
>(({ content, isFocused }, ref) => {
  logger.info("[IngredientAnalysis] Renderizando v2.0 (Focus-Aware).");

  if (!content) {
    logger.error(
      "[Guardián] Prop 'content' no proporcionada a IngredientAnalysis."
    );
    return (
      <DeveloperErrorDisplay
        context="IngredientAnalysis"
        errorMessage="Contrato de UI violado: La prop 'content' es requerida."
      />
    );
  }

  const { title, ingredients } = content;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ingredients.map((ingredient: Ingredient) => (
            <div
              key={ingredient.name}
              className="p-6 border border-white/10 rounded-lg text-center transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-primary mb-2">
                {ingredient.name}
              </h3>
              <p className="text-foreground/80">{ingredient.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
});
IngredientAnalysis.displayName = "IngredientAnalysis";
