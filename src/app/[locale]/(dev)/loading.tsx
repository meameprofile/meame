// RUTA: src/app/[locale]/(dev)/loading.tsx
/**
 * @file loading.tsx
 * @description Componente de presentación puro para la UI de carga del DCC.
 *              Actúa como la SSoT visual para todos los estados de carga del layout.
 * @version 2.0.0 (Pure & Reusable)
 * @author L.I.A. Legacy
 */
import React from "react";
import { DotsWave } from "@/components/ui/Loaders";
import { logger } from "@/shared/lib/logging";

export default function Loading() {
  logger.info("[Loading UI] Renderizando componente de presentación v2.0.");
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <DotsWave className="w-12 h-12 text-primary" />
      <p className="mt-4 text-lg font-semibold text-foreground animate-pulse">
        Forjando la Interfaz de Élite...
      </p>
    </div>
  );
}
