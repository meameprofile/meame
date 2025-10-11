// RUTA: src/components/features/campaign-suite/_components/StepClientWrapper.tsx
/**
 * @file StepClientWrapper.tsx
 * @description Despachador de Pasos 100% dinámico y Guardián de Contratos.
 *              Lee la SSoT de `wizard.config.ts` para obtener el componente y su
 *              schema, valida el contenido en tiempo de ejecución y renderiza el
 *              paso correspondiente con seguridad de tipos absoluta.
 * @version 15.0.0 (Config-Driven & Type-Safe Dispatcher)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { stepsConfig } from "@/shared/lib/config/campaign-suite/wizard.config";
import { logger } from "@/shared/lib/logging";

interface StepClientWrapperProps {
  stepContent: unknown; // La prop es 'unknown' para forzar una validación explícita.
}

export function StepClientWrapper({
  stepContent,
}: StepClientWrapperProps): React.ReactElement {
  logger.info(
    "[StepClientWrapper] Renderizando v15.0 (Config-Driven Dispatcher)."
  );

  const searchParams = useSearchParams();
  const currentStepId = parseInt(searchParams.get("step") || "0", 10);

  const stepConfig = stepsConfig.find((s) => s.id === currentStepId);

  if (!stepConfig) {
    const errorMessage = `Configuración no encontrada para el paso ${currentStepId}.`;
    logger.error(`[StepClientWrapper] ${errorMessage}`);
    return (
      <DeveloperErrorDisplay
        context="StepClientWrapper"
        errorMessage={errorMessage}
        errorDetails="Verifica que el ID del paso en la URL es válido y que existe una entrada correspondiente en 'wizard.config.ts'."
      />
    );
  }

  // Se obtiene el componente y su schema de validación directamente de la SSoT.
  const { component: StepComponent, schema } = stepConfig;

  // Se valida el contenido contra el schema del paso actual. Esto es nuestro guardián de tipos.
  const validation = schema.safeParse(stepContent);

  if (!validation.success) {
    const errorMessage = `Los datos de contenido para el paso ${currentStepId} (${stepConfig.i18nKey}) no cumplen con el contrato de Zod.`;
    logger.error(`[StepClientWrapper] ${errorMessage}`, {
      error: validation.error.flatten(),
    });
    return (
      <DeveloperErrorDisplay
        context="StepClientWrapper"
        errorMessage={errorMessage}
        errorDetails={validation.error}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Se pasa el contenido ya validado y con el tipo correcto al componente del paso. */}
        <StepComponent content={validation.data} />
      </motion.div>
    </AnimatePresence>
  );
}
