// RUTA: src/app/[locale]/(dev)/loading.tsx
/**
 * @file loading.tsx
 * @description Indicador de carga de élite para el layout del DCC.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
import React from "react";
import { DotsWave } from "@/components/ui/Loaders";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <DotsWave className="w-12 h-12 text-primary" />
      <p className="mt-4 text-lg font-semibold text-foreground animate-pulse">
        Estableciendo Conexión Segura con el DCC...
      </p>
    </div>
  );
}
