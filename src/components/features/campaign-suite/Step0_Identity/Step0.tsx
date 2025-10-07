// RUTA: src/components/features/campaign-suite/Step0_Identity/Step0.tsx
/**
 * @file Step0.tsx
 * @description Ensamblador y Cargador de Datos para el Paso 0 de la SDC.
 *              Forjado con un guardián de resiliencia y observabilidad de élite.
 * @version 7.0.0 (Logger Contract Compliance & Elite Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { logger } from "@/shared/lib/logging";
import { Step0Client } from "./Step0Client";
import { getBaseCampaignsAction } from "@/shared/lib/actions/campaign-suite/getBaseCampaigns.action";
import { DynamicIcon } from "@/components/ui";
import type { StepProps } from "@/shared/lib/types/campaigns/step.types";
import type { Step0ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step0.schema";
import type { z } from "zod";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Content = z.infer<typeof Step0ContentSchema>;

export default function Step0({
  content,
}: StepProps<Content>): React.ReactElement {
  const traceId = useMemo(() => logger.startTrace("Step0_Shell_v7.0"), []);
  const [baseCampaigns, setBaseCampaigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v7.0.0] ---
    const groupId = logger.startGroup(
      `[Step0 Shell] Ensamblando datos...`,
      traceId
    );
    // --- [FIN DE CORRECCIÓN DE CONTRATO v7.0.0] ---

    const fetchCampaigns = async () => {
      logger.traceEvent(traceId, "Iniciando fetch de campañas base...");
      const result = await getBaseCampaignsAction();
      if (result.success) {
        setBaseCampaigns(result.data);
        logger.success(
          `[Step0 Shell] Se cargaron ${result.data.length} campañas base.`,
          { traceId }
        );
      } else {
        toast.error("Error de Carga", { description: result.error });
        setError(result.error);
        logger.error("[Step0 Shell] Fallo al cargar campañas base.", {
          error: result.error,
          traceId,
        });
      }
      setIsLoading(false);
    };

    fetchCampaigns();

    return () => {
      // --- [INICIO DE CORRECCIÓN DE CONTRATO v7.0.0] ---
      logger.endGroup(groupId);
      logger.endTrace(traceId);
      // --- [FIN DE CORRECCIÓN DE CONTRATO v7.0.0] ---
    };
  }, [traceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <DynamicIcon name="LoaderCircle" className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <DeveloperErrorDisplay
        context="Step0 Server Shell"
        errorMessage="No se pudieron cargar los datos necesarios para este paso."
        errorDetails={error}
      />
    );
  }

  return <Step0Client content={content} baseCampaigns={baseCampaigns} />;
}
