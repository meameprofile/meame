// RUTA: src/shared/hooks/campaign-suite/use-iframe.ts
/**
 * @file use-iframe.ts
 * @description Hook de élite para gestionar el ciclo de vida de un iframe.
 * @version 2.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { logger } from "@/shared/lib/logging";

export function useIframe() {
  const traceId = logger.startTrace("useIframe_v2.0");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    logger.info("[useIframe] Hook montado.", { traceId });
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        logger.traceEvent(traceId, "Evento 'load' de iframe detectado. Inyectando estilos base.");
        iframeDoc.head.innerHTML = `<style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@700&display=swap');
            body { margin: 0; font-family: 'Inter', sans-serif; background-color: hsl(var(--background)); color: hsl(var(--foreground)); transition: background-color 0.3s ease, color 0.3s ease; scroll-behavior: smooth; }
            * { box-sizing: border-box; }
          </style>`;
        setIframeBody(iframeDoc.body);
        logger.success("[useIframe] Body del iframe listo para portal.", { traceId });
      }
    };

    if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
      handleLoad();
    } else {
      iframe.addEventListener("load", handleLoad);
    }

    return () => {
      iframe.removeEventListener("load", handleLoad);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  return { iframeRef, iframeBody };
}
