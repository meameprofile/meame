// RUTA: src/shared/hooks/telemetry/use-heimdall.hook.ts
/**
 * @file use-heimdall.hook.ts
 * @description Hook de efecto soberano para inicializar el pipeline de telemetría
 *              de Heimdall en el lado del cliente.
 * @version 1.0.2 (Absolute Type Safety & Holistic Fix)
 * @author L.I.A. Legacy
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { logger, flushTelemetryQueue } from "@/shared/lib/telemetry/heimdall.emitter";

const BATCH_INTERVAL_MS = 15000;

/**
 * @function useHeimdall
 * @description Hook de efecto que activa y gestiona el ciclo de vida del
 *              emisor de telemetría de Heimdall en el navegador.
 */
export function useHeimdall(): string {
  const traceId = useMemo(() => logger.startTrace("useHeimdall_Lifecycle"), []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted || typeof window === "undefined") return;

    setIsMounted(true);
    const groupId = logger.startGroup("[Heimdall Emitter] Hook montado.", { traceId });

    const intervalId = setInterval(() => {
      flushTelemetryQueue(false);
    }, BATCH_INTERVAL_MS);

    // --- [INICIO DE RESTAURACIÓN DE CONTRATO DE TIPO v1.0.2] ---
    // Se envuelve la llamada en un bloque para que la función de flecha
    // devuelva `void` y cumpla con la firma de tipo del event listener.
    const handleBeforeUnload = (): void => {
      flushTelemetryQueue(true);
    };
    // --- [FIN DE RESTAURACIÓN DE CONTRATO DE TIPO v1.0.2] ---

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalId);
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [isMounted, traceId]);

  return usePathname();
}
