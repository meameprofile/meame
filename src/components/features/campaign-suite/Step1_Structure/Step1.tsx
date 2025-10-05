// RUTA: src/components/features/campaign-suite/Step1_Structure/Step1.tsx
/**
 * @file Step1.tsx
 * @description Ensamblador de Cliente para el Paso 1 de la SDC (Estructura).
 *              Forjado con un guardián de resiliencia, observabilidad de ciclo de
 *              vida completo y cumplimiento de los 8 Pilares de Calidad.
 * @version 7.0.0 (Elite Resilience & Full Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import { Step1Client } from "./Step1Client";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step1ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step1.schema";
import type { z } from "zod";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

type Content = z.infer<typeof Step1ContentSchema>;

export default function Step1({
  content,
}: StepProps<Content>): React.ReactElement {
  const traceId = logger.startTrace("Step1_Shell_Render_v7.0");
  logger.startGroup(`[Step1 Shell] Ensamblando y delegando al cliente...`);

  try {
    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step1 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido validado con éxito.");
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

    logger.success(
      "[Step1 Shell] Datos validados. Renderizando Step1Client...",
      { traceId }
    );
    return <Step1Client content={content} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Guardián de Resiliencia][Step1] Fallo crítico en el ensamblador.",
      { error: errorMessage, traceId }
    );
    return (
      <DeveloperErrorDisplay
        context="Step1 Shell"
        errorMessage="No se pudo renderizar el componente del Paso 1 debido a un problema con los datos de entrada."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
