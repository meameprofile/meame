// components/layout/ThemeInjector.tsx
/**
 * @file ThemeInjector.tsx
 * @description Componente de servidor atómico para inyectar variables de tema.
 * @version 3.1.0 (Code Hygiene & FSD)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

/**
 * @component ThemeInjector
 * @description Placeholder arquitectónico. En la arquitectura actual, el tema
 *              global es estático. Este componente no necesita renderizar nada.
 * @returns {null} No renderiza ningún elemento.
 */
export function ThemeInjector(): null {
  logger.trace(
    "[Observabilidad] Renderizando ThemeInjector (no-op en la arquitectura actual)."
  );
  return null;
}
// components/layout/ThemeInjector.tsx
