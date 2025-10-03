// RUTA: src/shared/hooks/campaign-suite/use-preview-focus.ts
/**
 * @file use-preview-focus.ts
 * @description Hook atómico para gestionar el efecto secundario de scroll
 *              en el lienzo de previsualización. Es el cerebro del "Modo
 *              Enfoque Sincronizado".
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef } from "react";
import { useFocusStore } from "@/components/features/campaign-suite/_context/FocusContext";
import { logger } from "@/shared/lib/logging";

/**
 * @function usePreviewFocus
 * @description Un hook que se suscribe a los cambios en el `useFocusStore` y
 *              orquesta el desplazamiento suave (`scroll-into-view`) hacia la
 *              sección correspondiente en el lienzo de previsualización (EDVI).
 * @returns {{
 *   focusedSection: string | null;
 *   sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
 * }} Un objeto que contiene la sección actualmente enfocada y el objeto ref
 *    para ser adjuntado a los elementos del DOM de las secciones.
 */
export function usePreviewFocus() {
  // Pilar III (Observabilidad): Se traza la inicialización del hook.
  logger.trace("[usePreviewFocus] Hook de foco inicializado.");

  // Se suscribe al store de Zustand para obtener el estado de foco actual.
  const focusedSection = useFocusStore((state) => state.focusedSection);

  // Se utiliza un ref para mantener un mapa de los nodos DOM de cada sección.
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Efecto secundario que se dispara CADA VEZ que `focusedSection` cambia.
  useEffect(() => {
    if (focusedSection && sectionRefs.current[focusedSection]) {
      logger.info(
        `[MEA/UX] Activando Modo Enfoque. Desplazando a: ${focusedSection}`
      );
      // Orquesta la acción de scroll en el elemento DOM correspondiente.
      sectionRefs.current[focusedSection]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedSection]);

  return { focusedSection, sectionRefs };
}
