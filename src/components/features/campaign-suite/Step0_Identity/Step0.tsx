// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0.tsx
/**
 * @file Step0.tsx
 * @description Ensamblador de Servidor ("Server Shell") para el Paso 0 de la SDC.
 *              Obtiene los datos necesarios del servidor y los delega al
 *              componente de cliente para el renderizado interactivo.
 * @version 2.0.0 (Server Shell Architecture & Elite Compliance)
 * @author L.I.A. Legacy
 */
import "server-only";
import React from "react";
import type { z } from "zod";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { getBaseCampaignsAction } from "@/shared/lib/actions/campaign-suite/getBaseCampaigns.action";
import { logger } from "@/shared/lib/logging";
import type { Step0ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step0.schema";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";

import { Step0Client } from "./Step0Client";

type Content = z.infer<typeof Step0ContentSchema>;

export default async function Step0({
  content,
}: StepProps<Content>): Promise<React.ReactElement> {
  const traceId = logger.startTrace("Step0_ServerShell_v2.0");
  const groupId = logger.startGroup(
    `[Step0 Shell] Ensamblando datos del servidor...`
  );

  try {
    // --- Pilar VIII: Guardián de Resiliencia de Contrato ---
    if (!content) {
      throw new Error(
        "Contrato de UI violado: La prop 'content' para Step0 es nula o indefinida."
      );
    }
    logger.traceEvent(traceId, "Contrato de contenido i18n validado.");

    // --- Obtención de Datos del Servidor ---
    logger.traceEvent(traceId, "Invocando 'getBaseCampaignsAction'...");
    const campaignsResult = await getBaseCampaignsAction();
    if (!campaignsResult.success) {
      throw new Error(campaignsResult.error);
    }
    logger.traceEvent(
      traceId,
      `Se obtuvieron ${campaignsResult.data.length} campañas base.`
    );

    // --- Delegación al Cliente ---
    logger.success(
      "[Step0 Shell] Datos ensamblados. Delegando a Step0Client...",
      { traceId }
    );
    return (
      <Step0Client content={content} baseCampaigns={campaignsResult.data} />
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Step0 Shell] Fallo crítico durante el ensamblaje de datos.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return (
      <DeveloperErrorDisplay
        context="Step0 Server Shell"
        errorMessage="No se pudieron cargar los recursos necesarios para el Paso 0."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
