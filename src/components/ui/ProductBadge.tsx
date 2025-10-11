// RUTA: components/ui/ProductBadge.tsx
/**
 * @file ProductBadge.tsx
 * @description Componente de UI de élite para mostrar una insignia informativa
 *              (título y precio) superpuesta en imágenes o tarjetas. Inyectado
 *              con MEA/UX para una presentación dinámica y contextual.
 * @version 1.0.0 (Elite & Semantic Rename)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

import { Price } from "./Price"; // Consume nuestro componente de precio de élite

interface ProductBadgeProps {
  title: string;
  amount: string | number;
  currencyCode: string;
  locale: string;
  position?: "bottom" | "center";
  className?: string;
}

export function ProductBadge({
  title,
  amount,
  currencyCode,
  locale,
  position = "bottom",
  className,
}: ProductBadgeProps): React.ReactElement {
  logger.trace("[ProductBadge] Renderizando v1.0 (Elite & Semantic Rename).");

  const variants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={cn(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4",
        { "lg:px-20 lg:pb-[35%]": position === "center" },
        className
      )}
    >
      <div className="flex items-center rounded-full border border-border bg-background/70 p-1 text-xs font-semibold text-foreground backdrop-blur-md">
        <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-primary p-2 text-primary-foreground"
          amount={amount}
          currencyCode={currencyCode}
          locale={locale}
        />
      </div>
    </motion.div>
  );
}
