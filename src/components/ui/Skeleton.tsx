// RUTA: components/ui/Skeleton.tsx
/**
 * @file Skeleton.tsx
 * @description Componente de esqueleto de élite, inyectado con MEA/UX.
 * @version 2.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  logger.trace("[Skeleton] Renderizando esqueleto de élite v2.1.");

  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      {...props}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"
      />
    </div>
  );
}
