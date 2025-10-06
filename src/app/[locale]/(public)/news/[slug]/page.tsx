// RUTA: src/app/[locale]/(public)/news/[slug]/page.tsx
/**
 * @file page.tsx
 * @description Página de artículo de blog, blindada con un Guardián de Resiliencia
 *              Verboso, observabilidad de élite e importaciones soberanas.
 * @version 5.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { notFound } from "next/navigation";
import { CldImage } from "next-cloudinary";
import type { Metadata } from "next";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { PageHeader } from "@/components/layout/PageHeader";
// --- [INICIO] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---
import { ArticleBody } from "@/components/sections/ArticleBody";
import { CommentSection } from "@/components/sections/CommentSection";
// --- [FIN] REFACTORIZACIÓN POR ERRADICACIÓN DE BARREL FILE ---
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { SectionAnimator } from "@/components/layout/SectionAnimator";
import {
  getArticleBySlugAction,
  getPublishedArticlesAction,
} from "@/shared/lib/actions/cogniread";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";

interface NewsArticlePageProps {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams(): Promise<
  { locale: Locale; slug: string }[]
> {
  const result = await getPublishedArticlesAction({ page: 1, limit: 100 });
  if (!result.success) return [];
  const paths = result.data.articles.flatMap((article: CogniReadArticle) =>
    Object.entries(article.content).map(([locale, content]) => ({
      locale: locale as Locale,
      slug: (content as { slug: string }).slug,
    }))
  );
  return paths;
}

export async function generateMetadata({
  params: { locale, slug },
}: NewsArticlePageProps): Promise<Metadata> {
  const articleResult = await getArticleBySlugAction(slug, locale);
  if (!articleResult.success || !articleResult.data.article) {
    return { title: "Artículo no encontrado" };
  }
  const content = articleResult.data.article.content[locale];
  return {
    title: content?.title,
    description: content?.summary,
  };
}

export default async function NewsArticlePage({
  params: { locale, slug },
}: NewsArticlePageProps): Promise<React.ReactElement> {
  const traceId = logger.startTrace(`NewsArticlePage_Render_v5.0:${slug}`);
  logger.startGroup(
    `[NewsArticlePage Shell] Ensamblando datos para slug: "${slug}"...`,
    traceId
  );

  try {
    logger.traceEvent(traceId, "Iniciando obtención de datos del artículo...");
    const articleResult = await getArticleBySlugAction(slug, locale);
    logger.traceEvent(traceId, "Obtención de datos completada.");

    // --- [INICIO] GUARDIÁN DE RESILIENCIA Y OBSERVABILIDAD ---
    if (!articleResult.success) {
      // Este error es crítico y debe detener el renderizado.
      throw new Error(articleResult.error);
    }

    if (!articleResult.data.article) {
      logger.warn(
        `[Guardián] Artículo no encontrado para slug: "${slug}". Renderizando 404.`,
        { traceId }
      );
      return notFound();
    }

    const { article } = articleResult.data;
    const content = article.content[locale];

    if (!content || !content.title || !content.summary || !content.body) {
      const errorMessage = `El contenido para el locale '${locale}' en el artículo '${article.articleId}' está incompleto o ausente.`;
      logger.error(`[Guardián de Contrato] ${errorMessage}`, {
        articleId: article.articleId,
        locale,
        traceId,
      });
      return notFound();
    }
    logger.traceEvent(traceId, "Datos y contenido del artículo validados.");
    // --- [FIN] GUARDIÁN DE RESILIENCIA Y OBSERVABILIDAD ---

    logger.success(
      `[NewsArticlePage Shell] Ensamblaje completado. Renderizando UI para "${content.title}".`,
      { traceId }
    );

    return (
      <>
        <PageHeader
          content={{ title: content.title, subtitle: content.summary }}
        />
        <SectionAnimator>
          {article.baviHeroImageId && (
            <div className="relative w-full aspect-video max-w-5xl mx-auto -mt-16 rounded-lg overflow-hidden shadow-lg z-10">
              <CldImage
                src={article.baviHeroImageId}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1280px"
                priority
              />
            </div>
          )}
          <ArticleBody content={content.body} />
        </SectionAnimator>
        <CommentSection articleId={article.articleId} articleSlug={slug} />
      </>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[Guardián] Fallo crítico irrecuperable en NewsArticlePage para slug: "${slug}"`,
      { error: errorMessage, traceId }
    );
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="NewsArticlePage Server Shell"
        errorMessage={`No se pudo cargar el artículo [slug: ${slug}].`}
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
