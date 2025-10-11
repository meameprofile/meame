// RUTA: src/components/sections/NewsGridClient.tsx
/**
 * @file NewsGridClient.tsx
 * @description Componente de cliente puro ("Client Core") para renderizar la cuadrícula de noticias.
 * @version 2.0.0 (Sovereign Contract & Focus-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import React, { forwardRef } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Container, DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

export interface EnrichedArticle {
  id: string;
  title: string;
  summary: string;
  slug: string;
  publicId?: string;
}

interface NewsGridClientProps extends SectionProps<"newsGrid"> {
  articles: EnrichedArticle[];
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

export const NewsGridClient = forwardRef<HTMLElement, NewsGridClientProps>(
  ({ articles, locale, content, isFocused }, ref) => {
    logger.info("[NewsGridClient] Renderizando v2.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a NewsGridClient."
      );
      return (
        <DeveloperErrorDisplay
          context="NewsGridClient"
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
            {articles.map((article) => (
              <motion.div key={article.id} variants={cardVariants}>
                <Link
                  href={routes.newsBySlug.path({ locale, slug: article.slug })}
                  className="block group"
                >
                  <div className="overflow-hidden rounded-lg shadow-lg border border-border bg-card h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                    <div className="relative w-full h-48 bg-muted/50">
                      {article.publicId ? (
                        <CldImage
                          src={article.publicId}
                          alt={article.title}
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
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    );
  }
);
NewsGridClient.displayName = "NewsGridClient";
