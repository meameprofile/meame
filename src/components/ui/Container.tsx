// RUTA: components/ui/Container.tsx

/**
 * @file Container.tsx
 * @description Componente de UI fundamental y orquestador de animaciones MEA/UX.
 *              v3.0.0 (Holistic Elite Leveling & MEA Engine): Refactorizado a un
 *              componente `motion.div` que orquesta una animación de entrada
 *              escalonada (stagger) para todos sus hijos directos, creando una
 *              experiencia de usuario fluida y de alta performance en todo el sitio.
 *              Cumple con todos los pilares de la Directiva 026.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { logger } from "@/shared/lib/logging";

/**
 * @interface ContainerProps
 * @description Contrato de props para el componente Container.
 */
interface ContainerProps {
  /**
   * @param {React.ReactNode} children - Los elementos hijos que serán envueltos
   *        y potencialmente animados por el contenedor.
   */
  children: React.ReactNode;
  /**
   * @param {string} [className] - Clases de CSS adicionales para extender o
   *        sobreescribir los estilos base del contenedor.
   */
  className?: string;
}

/**
 * @constant containerVariants
 * @description Define los estados de la animación para framer-motion.
 *              'visible' utiliza `staggerChildren` para orquestar la animación
 *              en cascada de los elementos hijos.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // El tiempo de retraso entre la animación de cada hijo.
    },
  },
};

/**
 * @component Container
 * @description Renderiza un contenedor centrado y de ancho máximo que además
 *              actúa como un orquestador de animaciones para sus hijos.
 * @param {ContainerProps} props Las propiedades del componente.
 * @returns {React.ReactElement} El elemento JSX animado del contenedor.
 */
export function Container({
  children,
  className,
}: ContainerProps): React.ReactElement {
  logger.trace("[Container] Renderizando v3.0 (MEA Engine).");

  return (
    <motion.div
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }} // La animación se activa cuando el 10% es visible.
    >
      {children}
    </motion.div>
  );
}
