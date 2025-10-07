// RUTA: src/shared/hooks/aether/use-aether-telemetry.ts
/**
 * @file use-aether-telemetry.ts
 * @description Hook atómico para la telemetría de eventos de reproducción.
 * @version 3.0.0 (Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { logger } from "@/shared/lib/logging";
import type { VideoTexture } from "three";
import type {
  PlaybackEvent,
  PlaybackEventType,
} from "../use-cinematic-renderer";

export function useAetherTelemetry(
  videoTexture: VideoTexture,
  onPlaybackEvent?: (event: PlaybackEvent) => void
) {
  const traceId = useMemo(
    () => logger.startTrace("useAetherTelemetry_v3.0"),
    []
  );
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    logger.info("[Aether Telemetry] Hook montado.", { traceId });
    const getVisitorId = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
        logger.success(
          `[Aether Telemetry] Fingerprint de visitante obtenido: ${result.visitorId}`,
          { traceId }
        );
      } catch (error) {
        logger.error("[Aether Telemetry] Fallo al generar ID de visitante.", {
          error,
          traceId,
        });
      }
    };
    getVisitorId();
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const dispatchEvent = useCallback(
    (type: PlaybackEventType) => {
      if (onPlaybackEvent && visitorId) {
        const video = videoTexture.image as HTMLVideoElement;
        const eventData: PlaybackEvent = {
          type,
          timestamp: video.currentTime,
          duration: video.duration,
          visitorId,
        };
        logger.trace(`[Aether Telemetry] Despachando evento: ${type}`, {
          eventData,
          traceId,
        });
        onPlaybackEvent(eventData);
      }
    },
    [onPlaybackEvent, videoTexture, visitorId, traceId]
  );

  useEffect(() => {
    const video = videoTexture.image as HTMLVideoElement;
    const handlePlay = () => dispatchEvent("play");
    const handlePause = () => dispatchEvent("pause");
    const handleEnded = () => dispatchEvent("ended");
    const handleVolumeChange = () => dispatchEvent("volumechange");

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoTexture, dispatchEvent]);

  return { dispatchEvent };
}
