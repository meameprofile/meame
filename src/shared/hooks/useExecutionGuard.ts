// RUTA: src/shared/hooks/useExecutionGuard.ts
/**
 * @file useExecutionGuard.ts
 * @description Hook Soberano "Cortocircuito" para la prevención de bucles infinitos.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";

import { logger } from "@/shared/lib/logging";

interface ExecutionGuardOptions {
  name: string;
  threshold?: number;
  callback: () => (() => void) | void;
  dependencies: React.DependencyList;
}

interface ExecutionGuardResult {
  error: string | null;
}

const EXECUTION_LIMIT = 25;

export function useExecutionGuard({
  name,
  threshold = EXECUTION_LIMIT,
  callback,
  dependencies,
}: ExecutionGuardOptions): ExecutionGuardResult {
  const traceId = useMemo(
    () => logger.startTrace(`useExecutionGuard:${name}`),
    [name]
  );
  const executionCount = useRef(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) return;

    executionCount.current += 1;
    logger.trace(
      `[ExecutionGuard] Hook '${name}' ejecutado. Conteo: ${executionCount.current}`,
      { traceId }
    );

    if (executionCount.current > threshold) {
      const errorMessage = `¡Bucle Infinito Detectado! El hook '${name}' se ha ejecutado más de ${threshold} veces.`;
      logger.error(`[ExecutionGuard] ${errorMessage}`, {
        dependencies,
        traceId,
      });
      setError(errorMessage);
      return;
    }

    const cleanup = callback();

    return () => {
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    logger.info(`[ExecutionGuard] Guardián para '${name}' montado.`, {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [name, traceId]);

  return { error };
}
