// src/components/ui/FadeIn.tsx
/**
 * @file FadeIn.tsx
 * @description Componente de UI atómico que anima la aparición de sus hijos
 *              cuando entran en el viewport.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * @interface FadeInProps
 * @description Define el contrato de propiedades para el componente FadeIn.
 */
interface FadeInProps {
  /**
   * @param children Los elementos React que serán envueltos y animados.
   */
  children: React.ReactNode;
  /**
   * @param className Clases de CSS adicionales para aplicar al contenedor.
   */
  className?: string;
}

/**
 * @constant fadeInVariants
 * @description Define los estados de la animación para framer-motion.
 *              'hidden': Estado inicial, invisible y ligeramente desplazado.
 *              'visible': Estado final, completamente visible y en su posición original.
 */
const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Inicia 20px más abajo
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * @component FadeIn
 * @description Un contenedor que aplica una animación de "fade in + slide up"
 *              a sus hijos cuando se vuelven visibles en la pantalla.
 * @param {FadeInProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} El elemento JSX animado.
 */
export function FadeIn({
  children,
  className,
}: FadeInProps): React.ReactElement {
  console.log("[Observabilidad] Renderizando contenedor FadeIn");

  return (
    <motion.div
      className={twMerge(className)}
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // La animación se dispara cuando el 20% es visible
    >
      {children}
    </motion.div>
  );
}
// src/components/ui/FadeIn.tsx
