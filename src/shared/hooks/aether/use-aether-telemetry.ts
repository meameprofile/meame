// RUTA: src/shared/hooks/aether/use-aether-telemetry.ts
/**
 * @file use-aether-telemetry.ts
 * @description Hook atómico para la telemetría del motor Aether.
 *              Nivelado a un estándar de élite con higiene de código,
 *              observabilidad completa y cumplimiento de contratos soberanos.
 * @version 5.0.0 (Sovereign Contract Alignment & Elite Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/shared/lib/logging";
import type { PlaybackEvent, PlaybackEventType } from "./aether.contracts";

export function useAetherTelemetry(
  videoRef: React.RefObject<HTMLVideoElement | null>, // Se usa el RefObject directamente
  onPlaybackEvent?: (event: PlaybackEvent) => void
) {
  const traceId = useMemo(
    () => logger.startTrace("useAetherTelemetry_Lifecycle_v5.0"),
    []
  );
  const [visitorId, setVisitorId] = useState<string | null>(null);

  const dispatchEvent = useCallback(
    (type: PlaybackEventType) => {
      const video = videoRef.current;
      if (onPlaybackEvent && visitorId && video) {
        const eventData: PlaybackEvent = {
          type,
          timestamp: video.currentTime,
          duration: video.duration,
          visitorId,
        };
        onPlaybackEvent(eventData);
      }
    },
    [onPlaybackEvent, videoRef, visitorId]
  );

  useEffect(() => {
    const groupId = logger.startGroup(
      "[Aether Telemetry] Montando y configurando...",
      traceId
    );

    // Lógica para obtener un ID de visitante anónimo (simplificada)
    const getVisitorId = () => {
      let id = localStorage.getItem("aether_visitor_id");
      if (!id) {
        id = `visitor_${Date.now()}`;
        localStorage.setItem("aether_visitor_id", id);
      }
      setVisitorId(id);
      logger.traceEvent(traceId, `ID de visitante establecido: ${id}`);
    };

    getVisitorId();

    const videoElement = videoRef.current;
    if (!videoElement) {
      logger.endGroup(groupId);
      return;
    }

    const handlePlay = () => dispatchEvent("play");
    const handlePause = () => dispatchEvent("pause");
    const handleEnded = () => dispatchEvent("ended");
    const handleVolumeChange = () => dispatchEvent("volumechange");

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("volumechange", handleVolumeChange);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("volumechange", handleVolumeChange);
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [videoRef, dispatchEvent, traceId]);

  return { dispatchEvent };
}
