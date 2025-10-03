// RUTA: src/components/layout/SectionAnimator.tsx
/**
 * @file SectionAnimator.tsx
 * @description Orquestador de animación puro. Envuelve a sus hijos en una animación
 *              de entrada escalonada, cumpliendo con la arquitectura RSC.
 * @version 1.0.0 (RSC Architectural Integrity)
 *@author L.I.A. Legacy
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { logger } from "@/shared/lib/logging";

interface SectionAnimatorProps {
  children: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function SectionAnimator({ children }: SectionAnimatorProps) {
  logger.trace("[SectionAnimator] Renderizando orquestador de animación puro.");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={sectionVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
