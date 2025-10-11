// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3.tsx
/**
 * @file Step3.tsx
 * @description Ensamblador de Servidor ("Server Shell") para el Paso 3. Actúa como un
 *              "Server Shell" que obtiene los fragmentos de tema y los delega a su cliente,
 *              blindado con un Guardián de Resiliencia y observabilidad de élite.
 * @version 9.1.0 (Barrel File Eradication)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import React from "react";
import type { z } from "zod";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---
// Se elimina la dependencia del archivo barril y se importa la acción
// directamente desde su archivo soberano para garantizar la integridad del build.
import { loadAllThemeFragmentsAction } from "@/shared/lib/actions/campaign-suite/getThemeFragments.action";
import { logger } from "@/shared/lib/logging";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";

import { Step3Client } from "./Step3Client";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---

type Content = z.infer<typeof Step3ContentSchema>;

export default async function Step3({
  content,
}: StepProps<Content>): Promise<React.ReactElement> {
  const traceId = logger.startTrace("Step3_ServerShell_Render_v9.1");
  const groupId = logger.startGroup(
    `[Step3 Shell] Ensamblando datos para el Paso 3...`
  );

  try {
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step3 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido i18n validado.");

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
    logger.error(
      "[Guardián de Resiliencia][Step3] Fallo crítico en el ensamblador.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return (
      <DeveloperErrorDisplay
        context="Step3 Server Shell"
        errorMessage="No se pudieron cargar los recursos necesarios para el compositor de temas."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
