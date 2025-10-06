// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3.tsx
/**
 * @file Step3.tsx
 * @description Ensamblador de Servidor para el Paso 3. Actúa como un "Server Shell"
 *              que obtiene los fragmentos de tema y los delega a su cliente,
 *              blindado con un Guardián de Resiliencia y observabilidad de élite.
 * @version 9.0.0 (Resilient Data Provider & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { logger } from "@/shared/lib/logging";
import { Step3Client } from "./Step3Client";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { z } from "zod";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { loadAllThemeFragmentsAction } from "@/shared/lib/actions/campaign-suite";

type Content = z.infer<typeof Step3ContentSchema>;

export default async function Step3({
  content,
}: StepProps<Content>): Promise<React.ReactElement> {
  const traceId = logger.startTrace("Step3_ServerShell_Render_v9.0");
  logger.startGroup(`[Step3 Shell] Ensamblando datos para el Paso 3...`);

  try {
    if (!content) {
      throw new Error("Contrato de UI violado: La prop 'content' es nula.");
    }
    logger.traceEvent(traceId, "Contenido i18n validado.");

    const fragmentsResult = await loadAllThemeFragmentsAction();

    if (!fragmentsResult.success) {
      throw new Error(fragmentsResult.error);
    }
    logger.traceEvent(traceId, "Fragmentos de tema cargados con éxito.");

    return (
      <Step3Client content={content} loadedFragments={fragmentsResult.data} />
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Guardián de Resiliencia][Step3] Fallo crítico.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="Step3 Server Shell"
        errorMessage="No se pudieron cargar los recursos necesarios para el compositor de temas."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
