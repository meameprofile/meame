// RUTA: src/components/sections/NewsGrid.tsx
/**
 * @file NewsGrid.tsx
 * @description Cuadrícula de noticias, nivelada para una integridad de build definitiva y observabilidad mejorada.
 * @version 9.1.0 (Definitive Build Integrity & Nos3 Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { motion, type Variants } from "framer-motion";
import { Container, DynamicIcon } from "@/components/ui";
import { routes } from "@/shared/lib/navigation";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---
// Se realiza una importación quirúrgica para erradicar el riesgo de contaminación por "barrel files".
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---

interface NewsGridProps extends SectionProps<"newsGrid"> {
  articles: CogniReadArticle[];
  isFocused?: boolean;
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const NewsGrid = forwardRef<HTMLElement, NewsGridProps>(
  ({ articles, locale, content, isFocused }, ref) => {
    logger.info("[NewsGrid] Renderizando v9.1.0 (Definitive Build Integrity).");

    if (!content) {
      logger.error("[Guardián] Prop 'content' no proporcionada a NewsGrid.");
      return (
        <DeveloperErrorDisplay
          context="NewsGrid"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    return (
      <section
        ref={ref}
        className={cn(
          "py-16 sm:py-24 bg-background transition-all duration-300",
          isFocused && "ring-2 ring-primary"
        )}
      >
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{content.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {articles.map((article) => {
              const articleContent = article.content[locale];

              if (!articleContent || !articleContent.slug) {
                logger.warn(
                  `[NewsGrid] Artículo ${article.articleId} omitido por falta de contenido o slug en locale '${locale}'.`
                );
                return null;
              }

              return (
                <motion.div key={article.articleId} variants={cardVariants}>
                  <Link
                    href={routes.newsBySlug.path({
                      locale,
                      slug: articleContent.slug,
                    })}
                    className="block group"
                    data-nos3="article-card-link" // <-- MEJORA DE OBSERVABILIDAD
                  >
                    <div className="overflow-hidden rounded-lg shadow-lg border border-border bg-card h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                      <div className="relative w-full h-48 bg-muted/50">
                        {article.baviHeroImageId ? (
                          <CldImage
                            src={article.baviHeroImageId}
                            alt={articleContent.title || "Imagen del artículo"}
                            width={400}
                            height={225}
                            crop="fill"
                            gravity="auto"
                            format="auto"
                            quality="auto"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <DynamicIcon name="ImageOff" size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-primary flex-grow">
                          {articleContent.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {articleContent.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>
    );
  }
);
NewsGrid.displayName = "NewsGrid";
