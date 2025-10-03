// RUTA: components/ui/TestimonialCard.tsx

/**
 * @file TestimonialCard.tsx
 * @description Componente atómico de UI para mostrar un testimonio individual.
 *              v5.0.0 (Holistic Elite Leveling & MEA): Refactorizado para ser una
 *              experiencia de usuario de élite. Implementa el efecto 3D <TiltCard />,
 *              un icono de cita decorativo y participa en las animaciones de
 *              entrada orquestadas.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import { DynamicIcon } from "./DynamicIcon";
import { TiltCard } from "./TiltCard";

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
  imageSrc: string;
}

// Variante para que la tarjeta participe en la animación orquestada por su contenedor padre.
export const testimonialCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function TestimonialCard({
  quote,
  author,
  location,
  imageSrc,
}: TestimonialCardProps): React.ReactElement {
  logger.info("[TestimonialCard] Renderizando v5.0 (Elite & MEA).");

  return (
    <motion.article variants={testimonialCardVariants} className="h-full">
      <TiltCard className="h-full">
        <div className="relative h-full rounded-lg border border-border bg-background/50 p-6 shadow-lg transition-shadow hover:shadow-primary/20 flex flex-col">
          <DynamicIcon
            name="Quote"
            className="absolute top-4 right-4 h-16 w-16 text-muted/20 -z-10"
          />
          <div className="flex items-start gap-4 flex-grow">
            <Image
              src={imageSrc}
              alt={`Foto de ${author}`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover border-2 border-primary/50"
            />
            <blockquote className="text-foreground flex-grow">
              <p>&quot;{quote}&quot;</p>
            </blockquote>
          </div>
          <footer className="mt-4 text-right">
            <p className="font-bold text-primary">{author}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </footer>
        </div>
      </TiltCard>
    </motion.article>
  );
}
