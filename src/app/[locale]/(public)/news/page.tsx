// RUTA: src/app/[locale]/(public)/news/page.tsx
/**
 * @file page.tsx
 * @description Página de índice del blog ("Server Shell"), forjada con resiliencia,
 *              observabilidad de élite y una arquitectura de importación soberana.
 * @version 1.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
 */
import "server-only";
import React from "react";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
// --- [INICIO] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---
import { HeroNews } from "@/components/sections/HeroNews";
import { NewsGrid } from "@/components/sections/NewsGrid";
// --- [FIN] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---
import { getPublishedArticlesAction } from "@/shared/lib/actions/cogniread";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";

interface NewsPageProps {
  params: { locale: Locale };
}

export default async function NewsPage({ params: { locale } }: NewsPageProps) {
  const traceId = logger.startTrace("NewsPage_Render_v1.0");
  logger.startGroup(
    `[NewsPage Shell] Ensamblando datos para locale: ${locale}...`,
    traceId
  );

  try {
    logger.traceEvent(
      traceId,
      "Iniciando obtención de datos en paralelo (Artículos y Diccionario)..."
    );
    const [{ dictionary, error: dictError }, articlesResult] =
      await Promise.all([
        getDictionary(locale),
        getPublishedArticlesAction({ page: 1, limit: 10 }), // Cargar más artículos para la página principal del blog
      ]);
    logger.traceEvent(traceId, "Obtención de datos completada.");

    // --- [INICIO] GUARDIÁN DE RESILIENCIA ---
    if (dictError) throw dictError;

    const { heroNews, newsGrid } = dictionary;

    if (!heroNews || !newsGrid) {
      const missingKeys = [!heroNews && "heroNews", !newsGrid && "newsGrid"]
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Faltan claves de i18n esenciales. Claves ausentes: ${missingKeys}`
      );
    }

    if (!articlesResult.success) {
      // Este es un fallo recuperable en producción (mostramos la página sin artículos)
      logger.error(
        "[NewsPage Shell] No se pudieron obtener los artículos de CogniRead.",
        { error: articlesResult.error, traceId }
      );
      if (process.env.NODE_ENV === "development") {
        return (
          <DeveloperErrorDisplay
            context="NewsPage Data Fetching"
            errorMessage="Fallo al obtener artículos publicados desde la base de datos."
            errorDetails={articlesResult.error}
          />
        );
      }
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA ---

    const articles: CogniReadArticle[] = articlesResult.success
      ? articlesResult.data.articles
      : [];
    const featuredArticle = articles[0];
    const gridArticles = articles.slice(1);

    logger.success(
      `[NewsPage Shell] Ensamblaje completado. Renderizando UI con ${articles.length} artículos.`,
      { traceId }
    );

    return (
      <SectionAnimator>
        {featuredArticle && (
          <HeroNews
            content={heroNews}
            article={featuredArticle}
            locale={locale}
          />
        )}
        {gridArticles.length > 0 && (
          <NewsGrid
            articles={gridArticles}
            locale={locale}
            content={newsGrid}
          />
        )}
      </SectionAnimator>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Guardián] Fallo crítico irrecuperable en NewsPage Shell.", {
      error: errorMessage,
      traceId,
    });
    // En un fallo crítico (ej. diccionario), mostramos el error en desarrollo.
    return (
      <DeveloperErrorDisplay
        context="NewsPage Server Shell"
        errorMessage="Fallo crítico al renderizar la página principal del blog."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
