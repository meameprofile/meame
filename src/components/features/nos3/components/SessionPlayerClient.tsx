// RUTA: src/components/features/nos3/components/SessionPlayerClient.tsx
/**
 * @file SessionPlayerClient.tsx
 * @description Componente de cliente que envuelve e instancia el `rrweb-player`.
 * @version 3.0.0 (Sovereign & Architecturally Aligned)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect, useRef } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// La importación ahora apunta a la SSoT de tipos global.
import type { eventWithTime } from "@/shared/lib/types/rrweb.types";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
import { Card, CardContent } from "@/components/ui";
import { logger } from "@/shared/lib/logging";

interface SessionPlayerClientProps {
  events: eventWithTime[];
}

export function SessionPlayerClient({
  events,
}: SessionPlayerClientProps): React.ReactElement {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<rrwebPlayer | null>(null);

  useEffect(() => {
    const containerElement = playerContainerRef.current;
    if (containerElement && !playerInstanceRef.current) {
      logger.info(
        `[SessionPlayerClient] Montando instancia de rrweb-player con ${events.length} eventos...`
      );
      try {
        playerInstanceRef.current = new rrwebPlayer({
          target: containerElement,
          props: {
            events,
            autoPlay: true,
            showController: true,
            width: 1280,
            height: 720,
          },
        });
        logger.success(
          "[SessionPlayerClient] Reproductor rrweb instanciado con éxito."
        );
      } catch (error) {
        logger.error(
          "[SessionPlayerClient] Fallo crítico al instanciar rrwebPlayer.",
          { error }
        );
      }
    }

    return () => {
      if (playerInstanceRef.current && containerElement) {
        logger.info(
          "[SessionPlayerClient] Desmontando instancia de rrweb-player."
        );
        // Limpieza robusta del DOM
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }
        playerInstanceRef.current = null;
      }
    };
  }, [events]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div ref={playerContainerRef} className="rr-player-container"></div>
      </CardContent>
    </Card>
  );
}
