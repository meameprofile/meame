// RUTA: src/shared/hooks/campaign-suite/use-preview-focus.ts
/**
 * @file use-preview-focus.ts
 * @description Hook atómico para el "Modo Enfoque Sincronizado".
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFocusStore } from "@/components/features/campaign-suite/_context/FocusContext";
import { logger } from "@/shared/lib/logging";

export function usePreviewFocus() {
  const traceId = useMemo(() => logger.startTrace("usePreviewFocus_v2.0"), []);
  useEffect(() => {
    logger.info("[PreviewFocus Hook] Montado y escuchando cambios de foco.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const focusedSection = useFocusStore((state) => state.focusedSection);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (focusedSection && sectionRefs.current[focusedSection]) {
      logger.info(`[MEA/UX] Activando Modo Enfoque. Desplazando a: ${focusedSection}`, { traceId });
      sectionRefs.current[focusedSection]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedSection, traceId]);

  return { focusedSection, sectionRefs };
}
