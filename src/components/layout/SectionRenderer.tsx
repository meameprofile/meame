// RUTA: src/components/layout/SectionRenderer.tsx
/**
 * @file SectionRenderer.tsx
 * @description Orquestador de animación puro. Envuelve a sus hijos en una animación
 *              de entrada escalonada, cumpliendo con la arquitectura RSC.
 * @version 25.0.0 (RSC Architectural Integrity)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

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

export function SectionRenderer({ children }: SectionAnimatorProps) {
  // Ya no necesita el logger porque es un componente de presentación muy simple.
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
