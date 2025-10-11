// RUTA: src/components/features/campaign-suite/Step5_Management/Step5.tsx
/**
 * @file Step5.tsx
 * @description Ensamblador de Servidor ("Server Shell") para el Paso 5.
 *              Importa las Server Actions y las pasa como props a su hijo
 *              de cliente, restaurando la integridad de la frontera arquitectónica.
 * @version 9.1.0 (Server Component Identity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---
// Se elimina la directiva "use server". Este archivo es un React Server Component,
// no un módulo de Server Actions. Las acciones que importa ya tienen su propia
// directiva "use server" en sus archivos soberanos.
// "use server";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v9.1.0] ---

import React from "react";
import { type z } from "zod";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { deleteDraftAction } from "@/shared/lib/actions/campaign-suite/deleteDraft.action";
import { packageCampaignAction } from "@/shared/lib/actions/campaign-suite/packageCampaign.action";
import { publishCampaignAction } from "@/shared/lib/actions/campaign-suite/publishCampaign.action";
import { logger } from "@/shared/lib/logging";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";

import { Step5Client } from "./Step5Client";

type Content = z.infer<typeof Step5ContentSchema>;

export function Step5({ content }: StepProps<Content>): React.ReactElement {
  const traceId = logger.startTrace("Step5_Shell_Render_v9.1");
  const groupId = logger.startGroup(
    `[Step5 Shell] Ensamblando y delegando al cliente...`
  );

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

    const serverActions = {
      publish: publishCampaignAction,
      package: packageCampaignAction,
      delete: deleteDraftAction,
    };

    return (
      <Step5Client
        stepContent={content}
        actions={serverActions}
        locale={"it-IT"} // Locale hardcodeado temporalmente, se obtendrá del contexto en el futuro.
      />
    );
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
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
