// RUTA: src/components/layout/PageHeader.tsx
/**
 * @file PageHeader.tsx
 * @description Componente de élite para encabezados de página, ahora con
 *              capacidad de anulación de estilos para máxima flexibilidad.
 * @version 5.0.0 (Style Override Capability & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { LightRays } from "@/components/razBits/LightRays/LightRays";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import type { PageHeaderContentSchema } from "@/shared/lib/schemas/components/page-header.schema";
import type { z } from "zod";
import { cn } from "@/shared/lib/utils/cn";

type PageHeaderContent = z.infer<typeof PageHeaderContentSchema>;

export interface PageHeaderProps {
  content?: PageHeaderContent;
  titleClassName?: string; // <-- NUEVA PROP
  subtitleClassName?: string; // <-- NUEVA PROP
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

export function PageHeader({
  content,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps): React.ReactElement {
  if (!content) {
    const errorMessage =
      "Componente 'PageHeader' renderizado sin la prop 'content' requerida.";
    logger.error(`[PageHeader] ${errorMessage}`);
    if (process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="PageHeader"
          errorMessage={errorMessage}
          errorDetails="Asegúrate de que la página que llama a <PageHeader /> esté pasando la prop 'content'."
        />
      );
    }
    return <></>;
  }

  logger.info("[PageHeader] Renderizando v5.0 (Style Override Capable).");
  const { title, subtitle, lightRays } = content;

  return (
    <div className="relative bg-muted/20 py-24 sm:py-32 text-center overflow-hidden">
      {lightRays && (
        <LightRays
          config={lightRays}
          className="absolute inset-0 z-0 opacity-20"
        />
      )}
      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className={cn(
              "text-4xl font-bold tracking-tight text-primary sm:text-5xl",
              titleClassName // <-- FUSIÓN DE ESTILOS
            )}
          >
            {title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className={cn(
              "mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto",
              subtitleClassName // <-- FUSIÓN DE ESTILOS
            )}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
}
