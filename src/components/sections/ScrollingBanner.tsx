// RUTA: src/components/sections/ScrollingBanner.tsx
/**
 * @file ScrollingBanner.tsx
 * @description Componente de sección para una marquesina de anuncios desplazable.
 * @version 3.0.0 (Sovereign Contract & Focus-Aware)
 * @author L.I.A. Legacy
 */
"use client";

import React, { forwardRef } from "react";
import Marquee from "react-fast-marquee";
import { motion, type Variants } from "framer-motion";
import { DynamicIcon, Container } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { SectionProps } from "@/shared/lib/types/sections.types";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

interface ScrollingBannerProps extends SectionProps<"scrollingBanner"> {
  isFocused?: boolean;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const ScrollingBanner = forwardRef<HTMLElement, ScrollingBannerProps>(
  ({ content, isFocused }, ref) => {
    logger.info("[ScrollingBanner] Renderizando v3.0 (Focus-Aware).");

    if (!content) {
      logger.error(
        "[Guardián] Prop 'content' no proporcionada a ScrollingBanner."
      );
      return (
        <DeveloperErrorDisplay
          context="ScrollingBanner"
          errorMessage="Contrato de UI violado: La prop 'content' es requerida."
        />
      );
    }

    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        className={cn(
          "py-3 bg-muted/30 text-muted-foreground border-b transition-all duration-300",
          isFocused &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        role="status"
      >
        <Container>
          <Marquee speed={40} autoFill={true} pauseOnHover={true}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex items-center mx-12" key={index}>
                {content.iconName && (
                  <DynamicIcon
                    name={content.iconName}
                    className="h-4 w-4 mr-3 flex-shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="text-sm font-semibold tracking-wider"
                  dangerouslySetInnerHTML={{ __html: content.message }}
                />
              </div>
            ))}
          </Marquee>
        </Container>
      </motion.section>
    );
  }
);
ScrollingBanner.displayName = "ScrollingBanner";
