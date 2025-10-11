// RUTA: src/components/sections/FeaturedArticlesCarousel.tsx
/**
 * @file FeaturedArticlesCarousel.tsx
 * @description Un carrusel interactivo y automático que muestra artículos
 *              destacados, ahora con cumplimiento estricto de las Reglas de Hooks.
 * @version 2.1.0 (React Hooks Contract Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback, forwardRef } from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { logger } from "@/shared/lib/logging";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

interface FeaturedArticlesCarouselProps
  extends SectionProps<"featuredArticlesCarousel"> {
  interval?: number;
  isFocused?: boolean;
}

export const FeaturedArticlesCarousel = forwardRef<
  HTMLElement,
  FeaturedArticlesCarouselProps
>(({ content, interval = 4000, isFocused }, ref) => {
  logger.info(
    "[FeaturedArticlesCarousel] Renderizando v2.1 (Hooks Compliant)."
  );

  // [INICIO DE REFACTORIZACIÓN DE REGLAS DE HOOKS]
  // Todos los hooks se declaran incondicionalmente en el nivel superior.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const articles = content?.articles || [];

  const nextSlide = useCallback(() => {
    if (articles.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }
  }, [articles.length]);

  useEffect(() => {
    if (!isHovered && articles.length > 1) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [currentIndex, isHovered, interval, nextSlide, articles.length]);
  // [FIN DE REFACTORIZACIÓN DE REGLAS DE HOOKS]

  // El guardián de resiliencia ahora se ejecuta DESPUÉS de los hooks.
  if (!content || articles.length === 0) {
    logger.error(
      "[Guardián] Prop 'content' inválida o vacía en FeaturedArticlesCarousel."
    );
    return (
      <DeveloperErrorDisplay
        context="FeaturedArticlesCarousel"
        errorMessage="Contrato de UI violado: La prop 'content' o sus 'articles' son requeridos."
      />
    );
  }

  const { eyebrow, title } = content;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <section
      ref={ref}
      id="featured-articles"
      className={cn(
        "py-24 sm:py-32 bg-background/50 overflow-hidden transition-all duration-300",
        isFocused && "ring-2 ring-primary"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container className="text-center">
        <h2 className="text-lg text-primary mb-2 tracking-wider">{eyebrow}</h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-12">{title}</h3>
      </Container>
      <div className="relative h-[400px] flex items-center justify-center">
        <AnimatePresence>
          {[-2, -1, 0, 1, 2].map((offset) => {
            const index =
              (currentIndex + offset + articles.length) % articles.length;
            const article = articles[index];
            if (!article) return null;

            const isCenter = offset === 0;
            const zIndex = 5 - Math.abs(offset);
            const scale = 1 - Math.abs(offset) * 0.2;
            const opacity = 1 - Math.abs(offset) * 0.4;

            return (
              <motion.div
                key={index}
                className="absolute w-[60%] md:w-[45%] lg:w-[35%] aspect-video"
                initial={{
                  x: `${offset * 50}%`,
                  scale: 0.8,
                  opacity: 0,
                  zIndex: 0,
                }}
                animate={{ x: `${offset * 50}%`, scale, opacity, zIndex }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <div
                  className={cn(
                    "relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-300",
                    isCenter ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 60vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      {article.category}
                    </span>
                    <Link href={`/news/${article.slug}`} className="block mt-1">
                      <h4 className="text-lg md:text-xl font-bold text-white hover:underline">
                        {article.title}
                      </h4>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Button
          onClick={prevSlide}
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Artículo anterior"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={nextSlide}
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Siguiente artículo"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
});
FeaturedArticlesCarousel.displayName = "FeaturedArticlesCarousel";
