// RUTA: src/app/[locale]/(dev)/error.tsx
"use client";
import React, { useEffect } from "react";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { Button } from "@/components/ui";
interface DevErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DevError({ error, reset }: DevErrorProps) {
  useEffect(() => {
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
