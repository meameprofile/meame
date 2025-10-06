// RUTA: src/shared/hooks/campaign-suite/use-campaign-templates.ts
/**
 * @file use-campaign-templates.ts
 * @description Hook para la lógica de gestión de plantillas.
 * @version 4.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { useTransition, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { saveAsTemplateAction } from "@/shared/lib/actions/campaign-suite";
import { logger } from "@/shared/lib/logging";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export function useCampaignTemplates(draft: CampaignDraft) {
  const traceId = useMemo(
    () => logger.startTrace("useCampaignTemplates_v4.0"),
    []
  );
  useEffect(() => {
    logger.info("[Templates Hook] Montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isSavingTemplate, startSaveTransition] = useTransition();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

  const onSaveAsTemplate = (name: string, description: string) => {
    const actionTraceId = logger.startTrace("templates.onSaveAsTemplate");
    logger.startGroup(
      "[Templates Action] Guardando como Plantilla...",
      actionTraceId
    );

    if (!activeWorkspaceId) {
      toast.error("Error de contexto", {
        description: "No se ha seleccionado un workspace.",
      });
      logger.error("[Guardián] Intento de guardado sin workspace.", {
        traceId: actionTraceId,
      });
      logger.endGroup();
      logger.endTrace(actionTraceId);
      return;
    }

    startSaveTransition(async () => {
      const result = await saveAsTemplateAction(
        draft,
        name,
        description,
        activeWorkspaceId
      );
      if (result.success) {
        toast.success("¡Plantilla guardada con éxito!", {
          description: `La plantilla "${name}" ha sido creada.`,
        });
        logger.success(`[Templates] Plantilla '${name}' guardada.`, {
          traceId: actionTraceId,
        });
      } else {
        toast.error("Fallo al guardar la plantilla", {
          description: result.error,
        });
        logger.error("[Templates] Fallo al guardar.", {
          error: result.error,
          traceId: actionTraceId,
        });
      }
      logger.endGroup();
      logger.endTrace(actionTraceId);
    });
  };

  return { onSaveAsTemplate, isSavingTemplate };
}
