// RUTA: src/shared/hooks/aether/use-video-state.ts
/**
 * @file use-video-state.ts
 * @description Hook atómico y soberano para gestionar el estado de la UI del reproductor.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useMemo } from "react";

import { logger } from "@/shared/lib/logging";

export type VideoState = "loading" | "ready" | "error";

export function useVideoState(videoEl: HTMLVideoElement | null) {
  const traceId = useMemo(() => logger.startTrace("useVideoState_v1.0"), []);
  const [videoState, setVideoState] = useState<VideoState>("loading");

  useEffect(() => {
    logger.info("[useVideoState] Hook montado.", { traceId });
    if (!videoEl) {
      setVideoState("loading");
      return;
    }

    const handleCanPlay = () => {
      logger.traceEvent(
        traceId,
        "Evento 'canplaythrough' recibido. Estado: ready."
      );
      setVideoState("ready");
    };
    const handleError = () => {
      logger.error("[useVideoState] Evento 'error' del vídeo detectado.", {
        traceId,
      });
      setVideoState("error");
    };

    videoEl.addEventListener("canplaythrough", handleCanPlay);
    videoEl.addEventListener("error", handleError);

    // Comprobar estado inicial
    if (videoEl.readyState >= 4) {
      // HAVE_ENOUGH_DATA
      handleCanPlay();
    }

    return () => {
      videoEl.removeEventListener("canplaythrough", handleCanPlay);
      videoEl.removeEventListener("error", handleError);
      logger.endTrace(traceId);
    };
  }, [videoEl, traceId]);

  return { videoState };
}
