// RUTA: src/shared/hooks/aether/use-aether-telemetry.ts
/**
 * @file use-aether-telemetry.ts
 * @description Hook atómico y "sistema nervioso" para la telemetría del motor Aether.
 *              Este aparato es responsable de obtener una identidad única del visitante
 *              y de despachar eventos de reproducción estructurados para su análisis.
 *
 * @version 4.1.0 (React Hooks Contract Restoration & Elite Compliance): Refactorizado para
 *              cumplir estrictamente con las Reglas de los Hooks, moviendo toda la lógica
 *              condicional dentro de los efectos y callbacks para garantizar llamadas
 *              incondicionales en el nivel superior.
 * @author L.I.A. Legacy
 *
 * @architecture_notes
 * - **Pilar de Calidad (React)**: Todas las llamadas a hooks (`useMemo`, `useState`, `useCallback`, `useEffect`)
 *   se realizan incondicionalmente en el nivel superior, cumpliendo con el contrato fundamental de React.
 * - **Pilar III (Observabilidad)**: Utiliza un sistema de tracing anidado para una observabilidad
 *   forense del ciclo de vida del hook y de las operaciones críticas que orquesta.
 * - **Pilar VIII (Resiliencia)**: La lógica de los guardianes de contrato ahora reside dentro
 *   de los hooks, previniendo efectos secundarios sobre datos inválidos sin violar la arquitectura.
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

/**
 * @function useAetherTelemetry
 * @param {VideoTexture | null} videoTexture - La textura de vídeo de Three.js. Puede ser nula durante la inicialización.
 * @param {(event: PlaybackEvent) => void} [onPlaybackEvent] - Callback opcional para recibir los eventos de telemetría.
 * @returns {{ dispatchEvent: (type: PlaybackEventType) => void }} Un objeto que contiene la función para despachar eventos.
 */
export function useAetherTelemetry(
  videoTexture: VideoTexture | null,
  onPlaybackEvent?: (event: PlaybackEvent) => void
) {
  // --- Nivel Superior: Declaración Incondicional de Hooks ---
  const traceId = useMemo(
    () => logger.startTrace("useAetherTelemetry_Lifecycle_v4.1"),
    []
  );
  const [visitorId, setVisitorId] = useState<string | null>(null);

  const dispatchEvent = useCallback(
    (type: PlaybackEventType) => {
      const dispatchTraceId = logger.startTrace(`aether.dispatchEvent:${type}`);
      try {
        // La lógica de guarda ahora reside DENTRO del callback.
        if (onPlaybackEvent && visitorId && videoTexture?.image) {
          const video = videoTexture.image as HTMLVideoElement;
          const eventData: PlaybackEvent = {
            type,
            timestamp: video.currentTime,
            duration: video.duration,
            visitorId,
          };
          logger.trace(`[Aether Telemetry] Despachando evento: ${type}`, {
            eventData,
            traceId: dispatchTraceId,
          });
          onPlaybackEvent(eventData);
        } else {
          logger.traceEvent(dispatchTraceId, "Condiciones no cumplidas para despachar evento (sin callback, visitorId o videoTexture).");
        }
      } finally {
        logger.endTrace(dispatchTraceId);
      }
    },
    [onPlaybackEvent, videoTexture, visitorId]
  );

  useEffect(() => {
    const groupId = logger.startGroup("[Aether Telemetry] Montando y configurando...", traceId);

    // --- Guardián de Resiliencia Interno ---
    // La lógica se ejecuta dentro del hook, pero no causa un retorno temprano.
    if (!videoTexture?.image) {
      logger.warn("[Aether Telemetry] La videoTexture no es válida. El tracker no se activará en este render.", { traceId });
      logger.endGroup(groupId);
      logger.endTrace(traceId);
      return; // Termina la ejecución de este efecto, pero no viola las Reglas de Hooks.
    }

    const getVisitorId = async () => {
      const fingerprintTraceId = logger.startTrace("aether.getVisitorId");
      try {
        const fingerprintInstance = await FingerprintJS.load();
        const result = await fingerprintInstance.get();
        setVisitorId(result.visitorId);
        logger.success(
          `[Aether Telemetry] Fingerprint de visitante obtenido: ${result.visitorId}`,
          { traceId: fingerprintTraceId }
        );
      } catch (error) {
        logger.error("[Aether Telemetry] Fallo al generar el ID de visitante.", {
          error,
          traceId: fingerprintTraceId,
        });
      } finally {
        logger.endTrace(fingerprintTraceId);
      }
    };

    getVisitorId();

    const videoElement = videoTexture.image as HTMLVideoElement;
    const handlePlay = () => dispatchEvent("play");
    const handlePause = () => dispatchEvent("pause");
    const handleEnded = () => dispatchEvent("ended");
    const handleVolumeChange = () => dispatchEvent("volumechange");

    logger.traceEvent(traceId, "Añadiendo listeners de eventos de reproducción al elemento de vídeo.");
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("volumechange", handleVolumeChange);

    return () => {
      logger.traceEvent(traceId, "Limpiando listeners de eventos de reproducción.");
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("volumechange", handleVolumeChange);
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [videoTexture, dispatchEvent, traceId]);

  return { dispatchEvent };
}
