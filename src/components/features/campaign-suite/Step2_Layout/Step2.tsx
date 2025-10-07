// RUTA: src/components/features/campaign-suite/Step2_Layout/Step2.tsx
/**
 * @file Step2.tsx
 * @description Ensamblador de Cliente para el Paso 2 de la SDC (Layout).
 *              Forjado con un guardián de resiliencia, observabilidad de ciclo de
 *              vida completo y cumplimiento de los 8 Pilares de Calidad.
 * @version 7.0.0 (Elite Resilience & Full Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import { Step2Client } from "./Step2Client";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step2ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step2.schema";
import type { z } from "zod";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

type Content = z.infer<typeof Step2ContentSchema>;

export default function Step2({
  content,
}: StepProps<Content>): React.ReactElement {
  const traceId = logger.startTrace("Step2_Shell_Render_v7.0");
  const groupId = logger.startGroup(
    `[Step2 Shell] Ensamblando y delegando al cliente...`
  );

  try {
    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step2 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido validado con éxito.");
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

    logger.success(
      "[Step2 Shell] Datos validados. Renderizando Step2Client...",
      { traceId }
    );
    return <Step2Client content={content} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Guardián de Resiliencia][Step2] Fallo crítico en el ensamblador.",
      { error: errorMessage, traceId }
    );
    return (
      <DeveloperErrorDisplay
        context="Step2 Shell"
        errorMessage="No se pudo renderizar el componente del Paso 2 debido a un problema con los datos de entrada."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
