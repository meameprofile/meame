// RUTA: src/app/[locale]/HomePageClient.tsx
"use client";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { HeroNews } from "@/components/sections/HeroNews";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { useCogniReadCache } from "@/shared/hooks/use-cogniread-cache";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface HomePageClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function HomePageClient({ locale, dictionary }: HomePageClientProps) {
  // --- [INICIO DE REFACTORIZACIÓN DE HIGIENE] ---
  // Se deconstruye únicamente la variable 'articles' que se utiliza.
  const { articles } = useCogniReadCache();

  // El bloque 'if (isLoadingArticles)' y los componentes 'Skeleton' han sido eliminados.
  // En una arquitectura de élite, el manejo de estados de carga globales o
  // de nivel superior se delega a los Suspense Boundaries de React en el Server Shell.
  // --- [FIN DE REFACTORIZACIÓN DE HIGIENE] ---

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
