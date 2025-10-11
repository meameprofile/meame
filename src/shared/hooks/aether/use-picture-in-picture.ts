// RUTA: src/shared/hooks/aether/use-picture-in-picture.ts
/**
 * @file use-picture-in-picture.ts
 * @description Hook atómico y soberano para la gestión de la API Picture-in-Picture.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { logger } from "@/shared/lib/logging";

export function usePictureInPicture(videoEl: HTMLVideoElement | null) {
  const traceId = useMemo(
    () => logger.startTrace("usePictureInPicture_Lifecycle_v1.0"),
    []
  );
  const [isPipActive, setIsPipActive] = useState(false);
  const isPipSupported = "pictureInPictureEnabled" in document;

  useEffect(() => {
    logger.info("[PictureInPicture Hook] Montado.", {
      isPipSupported,
      traceId,
    });
    if (!isPipSupported) {
      logger.warn(
        "[Guardián] La API Picture-in-Picture no es soportada por este navegador.",
        { traceId }
      );
    }
    return () => logger.endTrace(traceId);
  }, [isPipSupported, traceId]);

  const togglePip = useCallback(async () => {
    if (!videoEl || !isPipSupported) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoEl.requestPictureInPicture();
      }
    } catch (error) {
      logger.error("[PictureInPicture] Fallo al alternar el modo PiP.", {
        error,
      });
    }
  }, [videoEl, isPipSupported]);

  useEffect(() => {
    if (!videoEl) return;

    const handleEnterPip = () => setIsPipActive(true);
    const handleLeavePip = () => setIsPipActive(false);

    videoEl.addEventListener("enterpictureinpicture", handleEnterPip);
    videoEl.addEventListener("leavepictureinpicture", handleLeavePip);

    return () => {
      videoEl.removeEventListener("enterpictureinpicture", handleEnterPip);
      videoEl.removeEventListener("leavepictureinpicture", handleLeavePip);
    };
  }, [videoEl]);

  return { isPipActive, togglePip, isPipSupported };
}
