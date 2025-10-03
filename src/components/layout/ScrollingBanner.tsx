// components/layout/ScrollingBanner.tsx
/**
 * @file ScrollingBanner.tsx
 * @description Componente de layout para una marquesina de alerta desplazable.
 *              v3.0.0 (Holistic Elite Leveling & MEA): Refactorizado para cumplir
 *              con los 7 Pilares de Calidad. Es 100% data-driven, consume tokens
 *              de theming semánticos y utiliza `react-fast-marquee` para una
 *              animación de alta performance.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

// --- Pilar I: i18n por Contrato ---
type ScrollingBannerContent = NonNullable<Dictionary["scrollingBanner"]>;

interface ScrollingBannerProps {
  content: ScrollingBannerContent;
}

export function ScrollingBanner({
  content,
}: ScrollingBannerProps): React.ReactElement {
  // --- Pilar III: Observabilidad ---
  logger.info(
    "[Observabilidad] Renderizando ScrollingBanner v3.0 (Client Component)"
  );

  return (
    // --- Pilar II: Theming Semántico ---
    // Se utilizan colores semánticos (destructive) en lugar de valores hardcodeados.
    <div
      className="py-2 text-sm font-bold text-destructive-foreground bg-destructive"
      role="alert"
    >
      <Marquee speed={50} autoFill={true} pauseOnHover={true}>
        {/* Se generan múltiples copias para un efecto de bucle infinito más suave */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex items-center mx-12" key={index}>
            <DynamicIcon
              name="TriangleAlert"
              className="h-4 w-4 mr-3 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="uppercase tracking-wider">{content.message}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
