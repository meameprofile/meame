// components/ui/TiltCard.tsx
/**
 * @file TiltCard.tsx
 * @description Componente envoltorio de alto orden (HOC) que aplica un efecto
 *              "tilt" 3D interactivo a su componente hijo.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @see .docs/directives/025_ADVANCED_UX_EXPLORATION_PROTOCOL.md
 */
"use client";

import React from "react";
import { Tilt } from "react-tilt";
import { cn } from "@/shared/lib/utils/cn";

/**
 * @interface TiltCardProps
 * @description Contrato de props para el componente TiltCard.
 */
interface TiltCardProps {
  /**
   * @prop children - El componente hijo que recibirá el efecto.
   */
  children: React.ReactNode;
  /**
   * @prop className - Clases adicionales para el contenedor del efecto.
   */
  className?: string;
  /**
   * @prop options - Opciones de configuración para la librería react-tilt.
   */
  options?: React.ComponentProps<typeof Tilt>["options"];
}

// Opciones de configuración por defecto para un efecto sutil y profesional.
const defaultTiltOptions = {
  max: 15, // Inclinación máxima (grados)
  scale: 1.02, // Escala al hacer hover
  speed: 500, // Velocidad de la transición
  glare: true, // Efecto de brillo
  "max-glare": 0.2, // Intensidad máxima del brillo
};

/**
 * @component TiltCard
 * @description Un envoltorio que aplica un efecto 3D a cualquier componente hijo.
 */
export function TiltCard({
  children,
  className,
  options = defaultTiltOptions,
}: TiltCardProps) {
  return (
    <Tilt options={options} className={cn("transform-style-3d", className)}>
      {children}
    </Tilt>
  );
}
// components/ui/TiltCard.tsx
