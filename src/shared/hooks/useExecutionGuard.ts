// RUTA: src/shared/hooks/useExecutionGuard.ts
/**
 * @file useExecutionGuard.ts
 * @description Hook Soberano "Cortocircuito" para la prevención de bucles infinitos.
 *              Monitoriza la frecuencia de ejecución de un efecto y lanza un
 *              error controlado si se supera un umbral, protegiendo la aplicación.
 * @version 1.0.0 (Guardian of Execution)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { logger } from "@/shared/lib/logging";

interface ExecutionGuardOptions {
  /** El nombre del hook o lógica que se está protegiendo (para logging). */
  name: string;
  /** El número máximo de ejecuciones permitidas en un corto período de tiempo. */
  threshold?: number;
  /** El callback que contiene la lógica a ejecutar. */
  callback: () => (() => void) | void;
  /** El array de dependencias, igual que en un useEffect. */
  dependencies: React.DependencyList;
}

interface ExecutionGuardResult {
  /** Un mensaje de error si el guardián se ha activado, de lo contrario null. */
  error: string | null;
}

const EXECUTION_LIMIT = 25; // Umbral por defecto

export function useExecutionGuard({
  name,
  threshold = EXECUTION_LIMIT,
  callback,
  dependencies,
}: ExecutionGuardOptions): ExecutionGuardResult {
  const executionCount = useRef(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si el guardián ya se activó, no hacemos nada más.
    if (error) return;

    executionCount.current += 1;

    logger.trace(
      `[ExecutionGuard] Hook '${name}' ejecutado. Conteo: ${executionCount.current}`
    );

    if (executionCount.current > threshold) {
      const errorMessage = `¡Bucle Infinito Detectado! El hook '${name}' se ha ejecutado más de ${threshold} veces. Se ha abortado la operación para proteger la aplicación.`;
      logger.error(`[ExecutionGuard] ${errorMessage}`, {
        dependencies,
      });
      setError(errorMessage);
      return; // Detiene la ejecución del callback
    }

    // Ejecuta la lógica del hook original.
    const cleanup = callback();

    // Devuelve la función de limpieza si el callback la proporcionó.
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { error };
}
