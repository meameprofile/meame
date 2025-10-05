// RUTA: src/shared/hooks/analytics/use-aura-tracker.ts
/**
 * @file use-aura-tracker.ts
 * @description Hook de cliente soberano para el sistema de analíticas "Aura".
 *              Implementa tracking de doble embudo, persistencia encriptada
 *              y envío robusto por lotes, cumpliendo con los 8 Pilares de Calidad.
 * @version 6.0.0 (Elite & Fully Operational)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { logger } from "@/shared/lib/logging";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { AuraEvent } from "@/shared/lib/schemas/analytics/aura.schema";

const USER_QUEUE_KEY = "aura_user_event_queue_v1";
const VISITOR_QUEUE_KEY = "aura_visitor_event_queue_v1";
const BATCH_INTERVAL = 300000; // 5 minutos
const MAX_BATCH_SIZE = 100; // Límite de eventos por lote

type AuraScope = "user" | "visitor";

interface AuraTrackerProps {
  scope: AuraScope;
  campaignId?: string;
  variantId?: string;
  enabled: boolean;
}

const cryptoEngine = {
  async getKey(): Promise<CryptoKey> {
    const secret =
      process.env.NEXT_PUBLIC_SESSION_PASSWORD ||
      "default-secret-for-aura-encryption";
    const salt = new TextEncoder().encode("aura-salt");
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },
  async encrypt(payload: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPayload = new TextEncoder().encode(payload);
    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedPayload
    );
    const encryptedBytes = new Uint8Array(encryptedContent);
    const resultBytes = new Uint8Array(iv.length + encryptedBytes.length);
    resultBytes.set(iv);
    resultBytes.set(encryptedBytes, iv.length);
    return btoa(String.fromCharCode.apply(null, Array.from(resultBytes)));
  },
  async decrypt(encrypted: string): Promise<string> {
    const key = await this.getKey();
    const encryptedBytesWithIv = new Uint8Array(
      Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    );
    const iv = encryptedBytesWithIv.slice(0, 12);
    const encryptedContent = encryptedBytesWithIv.slice(12);
    const decryptedContent = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedContent
    );
    return new TextDecoder().decode(decryptedContent);
  },
};

export function useAuraTracker({
  scope,
  campaignId,
  variantId,
  enabled,
}: AuraTrackerProps) {
  const traceId = useMemo(
    () => logger.startTrace(`auraTracker_v6.0:${scope}`),
    [scope]
  );
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );
  const pathname = usePathname();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enabled && scope === "visitor" && !fingerprintId) {
      const getFingerprint = async () => {
        try {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          setFingerprintId(result.visitorId);
          logger.traceEvent(
            traceId,
            `Fingerprint de visitante obtenido: ${result.visitorId}`
          );
        } catch (error) {
          logger.error("[AuraTracker] Fallo al obtener el fingerprint.", {
            error,
            traceId,
          });
        }
      };
      getFingerprint();
    }
  }, [scope, fingerprintId, enabled, traceId]);

  const sendBatch = useCallback(
    async (isUnloading = false) => {
      const storageKey = scope === "user" ? USER_QUEUE_KEY : VISITOR_QUEUE_KEY;
      const encryptedQueue = localStorage.getItem(storageKey);
      if (!encryptedQueue) return;

      try {
        const decryptedJSON = await cryptoEngine.decrypt(encryptedQueue);

        // Guardián de Resiliencia contra datos corruptos en localStorage
        let events: AuraEvent[];
        try {
          events = JSON.parse(decryptedJSON);
        } catch (parseError) {
          logger.error(
            `[AuraTracker] Datos corruptos en localStorage para ${storageKey}. Limpiando cola.`,
            { error: parseError, traceId }
          );
          localStorage.removeItem(storageKey);
          return;
        }

        if (events.length === 0) return;

        logger.traceEvent(
          traceId,
          `Enviando lote de ${events.length} eventos de ${scope}.`
        );
        const payload = { events };
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        if (isUnloading && navigator.sendBeacon) {
          navigator.sendBeacon("/api/aura/ingest", blob);
          localStorage.removeItem(storageKey);
        } else {
          const response = await fetch("/api/aura/ingest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-workspace-id": activeWorkspaceId || "",
            },
            body: JSON.stringify(payload),
            keepalive: true,
          });

          if (response.status === 202) {
            localStorage.removeItem(storageKey);
            logger.success(
              `[AuraTracker] Lote de ${scope} enviado y confirmado.`,
              { traceId }
            );
          } else {
            throw new Error(
              `El servidor respondió con estado ${response.status}`
            );
          }
        }
      } catch (error) {
        logger.error(
          "[AuraTracker] Fallo al desencriptar o enviar lote. Los datos permanecen en caché.",
          { error, scope, traceId }
        );
      }
    },
    [scope, activeWorkspaceId, traceId]
  );

  const trackEvent = useCallback(
    async (eventType: string, payload: Record<string, unknown> = {}) => {
      if (!enabled) return;

      const storageKey = scope === "user" ? USER_QUEUE_KEY : VISITOR_QUEUE_KEY;
      const event: AuraEvent = {
        sessionId: fingerprintId || "user_session",
        campaignId: campaignId || "n/a",
        variantId: variantId || "n/a",
        eventType,
        payload: { ...payload, pathname },
        timestamp: Date.now(),
      };

      logger.traceEvent(traceId, `Evento '${eventType}' capturado.`, { scope });

      try {
        const encryptedQueue = localStorage.getItem(storageKey);
        const currentQueue: AuraEvent[] = encryptedQueue
          ? JSON.parse(await cryptoEngine.decrypt(encryptedQueue))
          : [];

        const newQueue = [...currentQueue, event];
        localStorage.setItem(
          storageKey,
          await cryptoEngine.encrypt(JSON.stringify(newQueue))
        );

        if (newQueue.length >= MAX_BATCH_SIZE) {
          logger.info(
            `[AuraTracker] Lote lleno. Enviando ${newQueue.length} eventos.`,
            { traceId }
          );
          await sendBatch();
        }
      } catch (error) {
        logger.error(
          "[AuraTracker] Fallo al encriptar o guardar evento en localStorage.",
          { error, scope, traceId }
        );
      }
    },
    [
      enabled,
      scope,
      fingerprintId,
      campaignId,
      variantId,
      pathname,
      sendBatch,
      traceId,
    ]
  );

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    logger.info(`[AuraTracker] Tracker activado para scope: ${scope}.`, {
      traceId,
    });

    // Iniciar el intervalo de envío
    intervalRef.current = setInterval(() => sendBatch(), BATCH_INTERVAL);

    // Configurar el envío final al salir de la página
    const handleUnload = () => sendBatch(true);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      logger.info(`[AuraTracker] Limpiando para scope: ${scope}.`, {
        traceId,
      });
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleUnload);
      sendBatch(true); // Intento final de envío
      logger.endTrace(traceId);
    };
  }, [enabled, sendBatch, scope, traceId]);

  return { trackEvent, fingerprintId };
}
