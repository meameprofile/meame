// RUTA: src/components/features/campaign-suite/Step5_Management/Step5.tsx
/**
 * @file Step5.tsx
 * @description Ensamblador de Cliente para el Paso 5 de la SDC (Gestión).
 *              Forjado con un guardián de resiliencia y observabilidad de élite.
 * @version 6.0.0 (Elite Resilience & Full Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import { Step5Client } from "./Step5Client";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";
import { type z } from "zod";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { usePathname } from "next/navigation";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

type Content = z.infer<typeof Step5ContentSchema>;

export function Step5({ content }: StepProps<Content>): React.ReactElement {
  const traceId = logger.startTrace("Step5_Shell_Render_v6.0");
  logger.startGroup(`[Step5 Shell] Ensamblando y delegando al cliente...`);

  // Se obtiene el locale aquí para pasarlo al cliente, ya que es un Server Component "híbrido".
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);

  try {
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step5 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido validado con éxito.");

    logger.success(
      "[Step5 Shell] Datos validados. Renderizando Step5Client...",
      { traceId }
    );
    return <Step5Client locale={locale} stepContent={content} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Guardián de Resiliencia][Step5] Fallo crítico en el ensamblador.",
      { error: errorMessage, traceId }
    );
    return (
      <DeveloperErrorDisplay
        context="Step5 Shell"
        errorMessage="No se pudo renderizar el componente del Paso 5 debido a un problema con los datos de entrada."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
