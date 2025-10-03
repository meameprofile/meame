// components/razBits/MagicBento/use-bento-grid-interaction.ts
/**
 * @file use-bento-grid-interaction.ts
 * @description Hook de lógica para el componente MagicBento.
 * @version 1.3.0 (Linter Hygiene & FSD)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";
import type { MagicBentoConfigSchema } from "./magic-bento.schema";

type BentoConfig = z.infer<typeof MagicBentoConfigSchema>;

export const useBentoGridInteraction = (
  gridRef: React.RefObject<HTMLDivElement | null>,
  config: BentoConfig
) => {
  const isMobile = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth <= 768;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldDisableAnimations = config.disableAnimations || isMobile.current;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || shouldDisableAnimations || !config.enableSpotlight) return;

    logger.trace("[Bento] Inicializando Spotlight Effect");
    const spotlight = document.createElement("div");
    spotlight.style.cssText = `
      position: fixed; left: 0; top: 0;
      width: ${config.spotlightRadius! * 2}px;
      height: ${config.spotlightRadius! * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(var(--primary-rgb), 0.08), transparent 60%);
      pointer-events: none; transform: translate(-50%, -50%);
      z-index: 50; opacity: 0; transition: opacity 0.3s ease-in-out;
    `;
    document.body.appendChild(spotlight);

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
        opacity: 1,
      });
    };

    const onMouseLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.3 });
    };

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      if (spotlight.parentNode) {
        spotlight.parentNode.removeChild(spotlight);
      }
    };
  }, [
    gridRef,
    config.enableSpotlight,
    config.spotlightRadius,
    shouldDisableAnimations,
  ]);

  const initializeCardInteractions = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || shouldDisableAnimations) return;
      // Lógica de listeners de mousemove y mouseleave
    },
    [shouldDisableAnimations]
  );

  return { initializeCardInteractions };
};
// components/razBits/MagicBento/use-bento-grid-interaction.ts
