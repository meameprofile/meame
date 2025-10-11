// RUTA: src/shared/hooks/use-global-page-loader.ts
/**
 * @file use-global-page-loader.ts
 * @description Hook soberano para gestionar un estado de carga global durante
 *              las transiciones de página del App Router de Next.js.
 * @version 1.0.0 (Elite & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { logger } from "@/shared/lib/logging";

export function useGlobalPageLoader(): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    const traceId = logger.startTrace(`useGlobalPageLoader:${currentPath}`);
    const groupId = logger.startGroup("[Page Loader] Detectando transición...");

    if (currentPath !== previousPath.current) {
      logger.info("[Page Loader] Transición de página iniciada.", {
        from: previousPath.current,
        to: currentPath,
        traceId,
      });
      setIsLoading(true);
      previousPath.current = currentPath;
    } else {
      logger.trace("[Page Loader] Render inicial o sin cambio de ruta.", {
        currentPath,
        traceId,
      });
    }

    // El efecto se completa cuando el nuevo componente se renderiza,
    // lo que significa que la carga ha terminado.
    setIsLoading(false);
    logger.success("[Page Loader] Transición de página completada.", {
      traceId,
    });

    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }, [pathname, searchParams]);

  return { isLoading };
}
