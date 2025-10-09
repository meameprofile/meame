// RUTA: src/shared/hooks/aether/use-pip-with-detach-fallback.ts
/**
 * @file use-pip-with-detach-fallback.ts
 * @description Hook soberano que gestiona el modo Picture-in-Picture con un
 *              fallback resiliente a un modo "flotante" de CSS.
 * @version 1.2.0 (Typo Eradication & Elite Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/shared/lib/logging";

export function usePipWithDetachFallback(videoEl: HTMLVideoElement | null) {
  const traceId = useMemo(
    () => logger.startTrace("usePipWithDetachFallback_v1.2"),
    []
  );
  const [isPipActive, setIsPipActive] = useState(false);
  const [isDetached, setIsDetached] = useState(false);
  const isNativePipSupported = "pictureInPictureEnabled" in document;

  useEffect(() => {
    // --- [INICIO DE NIVELACIÓN DE REGRESIÓN v1.2.0] ---
    // Se corrige el nombre de la variable en el objeto de contexto del log.
    logger.info("[PictureInPicture Hook] Montado.", {
      isPipSupported: isNativePipSupported,
      traceId,
    });
    // --- [FIN DE NIVELACIÓN DE REGRESIÓN v1.2.0] ---
    if (!isNativePipSupported) {
      logger.warn(
        "[Guardián] La API Picture-in-Picture no es soportada por este navegador.",
        { traceId }
      );
    }
    return () => logger.endTrace(traceId);
  }, [isNativePipSupported, traceId]);

  const togglePip = useCallback(async () => {
    logger.traceEvent(traceId, "Acción: Alternar modo PiP/Desacoplado.");
    if (!videoEl) return;

    if (isNativePipSupported) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoEl.requestPictureInPicture();
        }
      } catch (error) {
        logger.error(
          "[PictureInPicture] Fallo al alternar el modo PiP nativo.",
          { error, traceId }
        );
      }
    } else {
      setIsDetached((prev) => !prev);
    }
  }, [videoEl, isNativePipSupported, traceId]);

  useEffect(() => {
    if (!videoEl || !isNativePipSupported) return;

    const handleEnterPip = () => setIsPipActive(true);
    const handleLeavePip = () => {
      setIsPipActive(false);
      setIsDetached(false);
    };

    videoEl.addEventListener("enterpictureinpicture", handleEnterPip);
    videoEl.addEventListener("leavepictureinpicture", handleLeavePip);

    return () => {
      videoEl.removeEventListener("enterpictureinpicture", handleEnterPip);
      videoEl.removeEventListener("leavepictureinpicture", handleLeavePip);
    };
  }, [videoEl, isNativePipSupported]);

  return {
    isPipActive: isPipActive || isDetached,
    togglePip,
    isPipSupported: isNativePipSupported,
  };
}
