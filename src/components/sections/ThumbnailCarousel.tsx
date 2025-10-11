// RUTA: src/components/sections/ThumbnailCarousel.tsx
/**
 * @file ThumbnailCarousel.tsx
 * @description Un carrusel visual que cicla a través de una serie de imágenes,
 *              ahora con funcionalidad de navegación completa y código limpio.
 * @version 6.2.0 (Code Hygiene & Functionality Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useMemo,
} from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Button, Container, DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { cn } from "@/shared/lib/utils/cn";

interface ThumbnailCarouselProps extends SectionProps<"thumbnailCarousel"> {
  interval?: number;
  isFocused?: boolean;
}

export const ThumbnailCarousel = forwardRef<
  HTMLElement,
  ThumbnailCarouselProps
>(({ content, interval = 5000, isFocused }, ref) => {
  const traceId = useMemo(
    () => logger.startTrace("ThumbnailCarousel_v6.2"),
    []
  );
  logger.info("[ThumbnailCarousel] Renderizando v6.2.", { traceId });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnails = content?.thumbnails || [];

  const nextSlide = useCallback(() => {
    if (thumbnails.length > 1) {
      logger.traceEvent(traceId, "Navegación automática: Siguiente slide.");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
    }
  }, [thumbnails.length, traceId]);

  useEffect(() => {
    if (thumbnails.length <= 1 || isHovered) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [currentIndex, thumbnails.length, interval, isHovered, nextSlide]);

  if (!content || thumbnails.length === 0) {
    return (
      <DeveloperErrorDisplay
        context="ThumbnailCarousel"
        errorMessage="Contrato de UI violado: Faltan 'content' o 'thumbnails'."
      />
    );
  }

  const { affiliateUrl, playButtonAriaLabel, playButtonTitle } = content;
  const currentThumbnail = thumbnails[currentIndex];

  const prevSlide = () => {
    logger.traceEvent(traceId, "Navegación manual: Slide anterior.");
    setCurrentIndex(
      (prev) => (prev - 1 + thumbnails.length) % thumbnails.length
    );
  };

  const handleNextClick = () => {
    logger.traceEvent(traceId, "Navegación manual: Siguiente slide.");
    nextSlide();
  };

  return (
    <section
      ref={ref}
      className={cn(
        "py-16 sm:py-24 transition-all duration-300",
        isFocused && "ring-2 ring-primary"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container className="max-w-4xl">
        <div className="relative aspect-video w-full group rounded-lg overflow-hidden border-4 border-foreground/10 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1">
          <AnimatePresence mode="wait">
            {currentThumbnail && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0.8, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentThumbnail.src}
                  alt={currentThumbnail.alt}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 896px"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center transition-opacity duration-300 group-hover:bg-foreground/20">
            <Button
              asChild
              className="p-0 bg-transparent shadow-none hover:scale-110 transition-transform duration-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label={playButtonAriaLabel}
            >
              <Link href={affiliateUrl}>
                <div className="bg-black/50 rounded-full p-4 sm:p-6 backdrop-blur-sm">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <title>{playButtonTitle}</title>
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                  </svg>
                </div>
              </Link>
            </Button>
          </div>
          {/* --- FUNCIONALIDAD RESTAURADA --- */}
          <Button
            onClick={prevSlide}
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Artículo anterior"
          >
            <DynamicIcon name="ChevronLeft" />
          </Button>
          <Button
            onClick={handleNextClick}
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Siguiente artículo"
          >
            <DynamicIcon name="ChevronRight" />
          </Button>
        </div>
      </Container>
    </section>
  );
});
ThumbnailCarousel.displayName = "ThumbnailCarousel";
