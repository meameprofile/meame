// RUTA: src/app/[locale]/(dev)/error.tsx
/**
 * @file error.tsx
 * @description Guardián de Resiliencia de Renderizado para el Developer Command Center (DCC).
 *              Este aparato intercepta cualquier error de tiempo de ejecución que ocurra
 *              durante el renderizado de los componentes de servidor dentro del grupo (dev),
 *              y muestra una interfaz de error detallada utilizando nuestro DeveloperErrorDisplay.
 * @version 1.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useEffect } from "react";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { Button } from "@/components/ui";

interface DevErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DevError({ error, reset }: DevErrorProps) {
  useEffect(() => {
    // Pilar III: Observabilidad Profunda
    logger.error(
      "[Guardián de Renderizado DCC] Error de tiempo de ejecución capturado.",
      {
        errorMessage: error.message,
        digest: error.digest,
        stack: error.stack,
      }
    );
  }, [error]);

  return (
    <div className="container py-12">
      <DeveloperErrorDisplay
        context="Next.js App Router (dev)"
        errorMessage="Ocurrió un error irrecuperable al intentar renderizar esta página."
        errorDetails={error}
      />
      <div className="mt-6 text-center">
        <Button onClick={() => reset()} variant="outline">
          Intentar Renderizar de Nuevo
        </Button>
      </div>
    </div>
  );
}
