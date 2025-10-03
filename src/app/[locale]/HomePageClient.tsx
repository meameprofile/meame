// RUTA: src/app/[locale]/HomePageClient.tsx
/**
 * @file HomePageClient.tsx
 * @description "Client Core" para el Homepage. Gestiona la carga de artículos desde caché.
 * @version 2.0.0 (Build Integrity Restoration)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use client";

import React from "react";
import { useCogniReadCache } from "@/shared/hooks/use-cogniread-cache";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: IMPORTACIONES ATÓMICAS] ---
// Se importan los componentes directamente desde sus archivos soberanos
// para evitar la contaminación del "barrel file".
import { HeroNews } from "@/components/sections/HeroNews";
import { NewsGrid } from "@/components/sections/NewsGrid";
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---
import { Skeleton } from "@/components/ui";

interface HomePageClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function HomePageClient({ locale, dictionary }: HomePageClientProps) {
  const { articles, isLoading: isLoadingArticles } = useCogniReadCache();

  if (isLoadingArticles) {
    return (
      <div className="container py-12 space-y-8">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const { heroNews, newsGrid } = dictionary;
  if (!heroNews || !newsGrid) {
    return (
      <DeveloperErrorDisplay
        context="HomePageClient"
        errorMessage="Faltan claves de contenido i18n para los componentes dinámicos."
      />
    );
  }

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 4);

  return (
    <>
      {featuredArticle && (
        <HeroNews
          content={heroNews}
          article={featuredArticle}
          locale={locale}
        />
      )}
      {gridArticles.length > 0 && (
        <NewsGrid articles={gridArticles} locale={locale} content={newsGrid} />
      )}
    </>
  );
}
