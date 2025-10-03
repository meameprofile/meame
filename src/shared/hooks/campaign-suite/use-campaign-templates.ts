// RUTA: src/shared/hooks/campaign-suite/use-campaign-templates.ts
/**
 * @file use-campaign-templates.ts
 * @description Hook atómico para encapsular la lógica de cliente de la gestión de plantillas.
 *              Ahora es consciente del contexto del workspace.
 * @version 3.0.0 (Workspace-Aware)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { saveAsTemplateAction } from "@/shared/lib/actions/campaign-suite";
import { logger } from "@/shared/lib/logging";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store"; // <-- IMPORTACIÓN DEL STORE
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export function useCampaignTemplates(draft: CampaignDraft) {
  const [isSavingTemplate, startSaveTransition] = useTransition();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  ); // <-- OBTENER WORKSPACE ACTIVO

  const onSaveAsTemplate = (name: string, description: string) => {
    logger.startGroup("[Templates Hook] Guardando como Plantilla");

    // --- GUARDIA DE CONTEXTO ---
    if (!activeWorkspaceId) {
      toast.error("Error de contexto", {
        description: "No se ha seleccionado un workspace activo.",
      });
      logger.error(
        "[Templates Hook] Intento de guardado sin workspace activo."
      );
      logger.endGroup();
      return;
    }
    // --- FIN DE GUARDIA ---

    startSaveTransition(async () => {
      const result = await saveAsTemplateAction(
        draft,
        name,
        description,
        activeWorkspaceId
      ); // <-- PASAR WORKSPACE ID
      if (result.success) {
        toast.success("¡Plantilla guardada con éxito!", {
          description: `La plantilla "${name}" ha sido creada.`,
        });
      } else {
        toast.error("Fallo al guardar la plantilla", {
          description: result.error,
        });
      }
      logger.endGroup();
    });
  };

  return {
    onSaveAsTemplate,
    isSavingTemplate,
  };
}
