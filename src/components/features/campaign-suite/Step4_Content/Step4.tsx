// RUTA: src/components/features/campaign-suite/Step4_Content/Step4.tsx
/**
 * @file Step4.tsx
 * @description Ensamblador de Cliente para el Paso 4 de la SDC (Contenido),
 *              forjado con un guardián de resiliencia y observabilidad de élite.
 * @version 5.0.0 (Elite Resilience & Full Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import { Step4Client } from "./Step4Client";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step4ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step4.schema";
import type { z } from "zod";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

type Content = z.infer<typeof Step4ContentSchema>;

export default function Step4({
  content,
}: StepProps<Content>): React.ReactElement {
  const traceId = logger.startTrace("Step4_Shell_Render_v5.0");
  logger.startGroup(`[Step4 Shell] Ensamblando y delegando al cliente...`);

  try {
    // --- [INICIO] GUARDIÁN DE RESILIENCIA DE CONTRATO ---
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step4 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido validado con éxito.");
    // --- [FIN] GUARDIÁN DE RESILIENCIA DE CONTRATO ---

    logger.success(
      "[Step4 Shell] Datos validados. Renderizando Step4Client...",
      { traceId }
    );
    return <Step4Client content={content} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Guardián de Resiliencia][Step4] Fallo crítico en el ensamblador.",
      { error: errorMessage, traceId }
    );
    return (
      <DeveloperErrorDisplay
        context="Step4 Shell"
        errorMessage="No se pudo renderizar el componente del Paso 4 debido a un problema con los datos de entrada."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
