// RUTA: src/shared/hooks/aether/use-aether-telemetry.ts
/**
 * @file use-aether-telemetry.ts
 * @description Hook atómico para la telemetría de eventos de reproducción.
 * @version 2.0.0 (Sovereign Type Import)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { logger } from "@/shared/lib/logging";
import type { VideoTexture } from "three";
// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: IMPORTACIÓN SOBERANA] ---
import type {
  PlaybackEvent,
  PlaybackEventType,
} from "../use-cinematic-renderer";
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export function useAetherTelemetry(
  videoTexture: VideoTexture,
  onPlaybackEvent?: (event: PlaybackEvent) => void
) {
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    const getVisitorId = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
      } catch (error) {
        logger.error("[Fingerprint] Fallo al generar el ID de visitante.", {
          error,
        });
      }
    };
    getVisitorId();
  }, []);

  const dispatchEvent = useCallback(
    (type: PlaybackEventType) => {
      if (onPlaybackEvent && visitorId) {
        const video = videoTexture.image as HTMLVideoElement;
        onPlaybackEvent({
          type,
          timestamp: video.currentTime,
          duration: video.duration,
          visitorId,
        });
      }
    },
    [onPlaybackEvent, videoTexture, visitorId]
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
