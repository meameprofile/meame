// RUTA: components/razBits/LightRays/LightRays.tsx
/**
 * @file LightRays.tsx
 * @description Componente de presentación puro para el efecto de fondo de rayos de luz.
 *              v3.0.0 (Naming Convention Fix): Se alinea la importación del
 *              hook con la convención de nomenclatura kebab-case.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

// --- [INICIO DE CORRECCIÓN DE RUTA] ---
import { useLightRays } from "@/components/razBits/LightRays/use-light-rays";
// --- [FIN DE CORRECCIÓN DE RUTA] ---
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { LightRaysConfigSchema } from "./light-rays.schema";

interface LightRaysProps {
  config: Dictionary["lightRays"];
  className?: string;
}

export function LightRays({
  config,
  className,
}: LightRaysProps): React.ReactElement | null {
  logger.info("[Observabilidad] Renderizando componente LightRays v3.0");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const validatedConfig = LightRaysConfigSchema.parse(config || {});

  useLightRays(containerRef, validatedConfig);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "w-full h-full pointer-events-none z-0 overflow-hidden relative",
        className
      )}
      aria-hidden="true"
    />
  );
}
