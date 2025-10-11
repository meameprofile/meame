// RUTA: src/components/features/analytics/HeimdallInitializer.tsx
/**
 * @file HeimdallInitializer.tsx
 * @description Componente de cliente "headless" para inicializar el emisor de Heimdall.
 * @version 1.0.0 (Sovereign & Architecturally Pure)
 * @author L.I.A. Legacy
 */
"use client";

import { useHeimdall } from "@/shared/hooks/telemetry/use-heimdall.hook";

/**
 * @function HeimdallInitializer
 * @description Este componente no renderiza nada. Su única misión es llamar al
 *              hook `useHeimdall` para activar el pipeline de telemetría del lado del cliente.
 */
export function HeimdallInitializer(): null {
  useHeimdall();
  return null;
}
