// components/ui/cinematic-controls/BrandLogo.tsx
/**
 * @file BrandLogo.tsx
 * @description Componente de UI atómico para el logo "Raz WriTe - News".
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @status Active
 */
"use client";

import React from "react";

import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

/**
 * @interface BrandLogoProps
 * @description Contrato de props para el componente BrandLogo.
 */
interface BrandLogoProps {
  className?: string;
}

/**
 * @component BrandLogo
 * @description Renderiza el logo de la marca para el renderizador.
 */
export function BrandLogo({ className }: BrandLogoProps): React.ReactElement {
  logger.trace("[BrandLogo] Componente de logo renderizado.");

  return (
    <div
      className={cn(
        "absolute top-4 left-4 md:top-6 md:left-6 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md",
        "text-xs font-bold text-foreground pointer-events-auto", // Permite eventos de clic si es necesario
        className
      )}
    >
      RaZ WriTe - <span className="text-primary">NeWs</span>
    </div>
  );
}
// components/ui/cinematic-controls/BrandLogo.tsx
