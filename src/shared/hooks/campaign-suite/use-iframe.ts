// RUTA: src/shared/hooks/campaign-suite/use-iframe.ts
/**
 * @file use-iframe.ts
 * @description Hook de élite para gestionar el ciclo de vida de un iframe
 *              y prepararlo para ser un portal de React.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { logger } from "@/shared/lib/logging";

export function useIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        logger.trace("[useIframe] Iframe cargado. Inyectando estilos base.");
        iframeDoc.head.innerHTML = `
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@700&family=Playfair+Display:wght@700&display=swap');
            body {
              margin: 0;
              font-family: 'Inter', sans-serif;
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
              transition: background-color 0.3s ease, color 0.3s ease;
              scroll-behavior: smooth;
            }
            * { box-sizing: border-box; }
          </style>
        `;
        setIframeBody(iframeDoc.body);
      }
    };

    if (
      iframe.contentDocument &&
      iframe.contentDocument.readyState === "complete"
    ) {
      handleLoad();
    } else {
      iframe.addEventListener("load", handleLoad);
    }

    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  return { iframeRef, iframeBody };
}
