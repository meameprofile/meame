// RUTA: src/components/features/commerce/StoreClient.tsx
/**
 * @file StoreClient.tsx
 * @description Componente "cerebro" de cliente para la tienda, forjado con
 *              importaciones soberanas, resiliencia y observabilidad de élite.
 * @version 5.0.0 (Sovereign Imports & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo } from "react";
import { Container } from "@/components/ui";
import { useProductFilters } from "@/shared/hooks/use-product-filters";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

// --- [INICIO] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---
import { ProductFilters } from "@/components/sections/ProductFilters";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CommunitySection } from "@/components/sections/CommunitySection";
// --- [FIN] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---

interface StoreClientProps {
  initialProducts: Product[];
  content: {
    storePage?: Dictionary["storePage"];
    faqAccordion?: Dictionary["faqAccordion"];
    communitySection?: Dictionary["communitySection"];
  };
  locale: Locale;
}

export function StoreClient({
  initialProducts,
  content,
  locale,
}: StoreClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("StoreClient_Lifecycle_v5.0"),
    []
  );
  logger.info("[StoreClient] Renderizando orquestador v5.0.", { traceId });

  const { filters, setFilters, filteredProducts } =
    useProductFilters(initialProducts);

  const allTags = useMemo(() => {
    logger.traceEvent(traceId, "Calculando todas las etiquetas de productos.");
    return Array.from(
      new Set(
        initialProducts.flatMap((p) => [
          p.categorization.primary,
          ...(p.categorization.secondary || []),
        ])
      )
    );
  }, [initialProducts, traceId]);

  // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
  if (
    !content.storePage ||
    !content.faqAccordion ||
    !content.communitySection
  ) {
    const errorMsg =
      "Contrato de UI violado: Faltan una o más propiedades de contenido requeridas.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <Container className="py-16">
        <DeveloperErrorDisplay context="StoreClient" errorMessage={errorMsg} />
      </Container>
    );
  }
  // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

  return (
    <>
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <ProductFilters
            filtersContent={content.storePage.filters}
            allTags={allTags}
            filtersState={filters}
            onFilterChange={setFilters}
          />
          <ProductGrid
            products={filteredProducts}
            locale={locale}
            content={content.storePage}
          />
        </div>
      </Container>

      <FaqAccordion content={content.faqAccordion} locale={locale} />
      <CommunitySection content={content.communitySection} locale={locale} />
    </>
  );
}
