// RUTA: src/shared/hooks/campaign-suite/use-template-loader.ts
/**
 * @file use-template-loader.ts
 * @description Hook de élite para orquestar la carga de plantillas, ahora alineado
 *              con la arquitectura de estado centralizado "Forja Centralizada".
 * @version 8.0.0 (Centralized Forge Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { loadTemplateAction } from "@/shared/lib/actions/campaign-suite";
import { logger } from "@/shared/lib/logging";
import { useCampaignDraftStore } from "./use-campaign-draft.store";
import { routes } from "@/shared/lib/navigation";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { generateDraftId } from "@/shared/lib/utils/campaign-suite/draft.utils";

export function useTemplateLoader(onLoadComplete?: () => void) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const firstStepId = stepsDataConfig[0].id;
  const setDraft = useCampaignDraftStore((state) => state.setDraft);

  const loadTemplate = (templateId: string, copySuffix: string) => {
    const traceId = logger.startTrace(`loadTemplate:${templateId}`);
    const groupId = logger.startGroup(
      `[TemplateLoader] Orquestando carga v8.0...`,
      traceId
    );

    startTransition(async () => {
      try {
        const result = await loadTemplateAction(templateId);
        if (!result.success) throw new Error(result.error);

        const { draftData } = result.data;
        logger.traceEvent(
          traceId,
          "Datos de plantilla recibidos. Hidratando store centralizado..."
        );

        // Se ensambla el nuevo estado del borrador y se hidrata el store de una sola vez.
        const newDraftState = {
          ...draftData,
          draftId: generateDraftId(draftData.baseCampaignId || "template"),
          variantName: `${draftData.variantName}${copySuffix}`,
          completedSteps: [], // Un nuevo borrador siempre empieza desde cero.
          updatedAt: new Date().toISOString(),
        };

        setDraft(newDraftState);

        logger.success("[TemplateLoader] Store centralizado hidratado.", {
          traceId,
        });
        toast.success("Plantilla cargada con éxito.");

        router.push(
          routes.creatorCampaignSuite.path({
            locale,
            stepId: [String(firstStepId)],
          })
        );
        if (onLoadComplete) onLoadComplete();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido.";
        logger.error("[TemplateLoader] Fallo crítico durante la carga.", {
          error: errorMessage,
          traceId,
        });
        toast.error("Error al cargar la plantilla", {
          description: errorMessage,
        });
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(traceId);
      }
    });
  };

  return { loadTemplate, isPending };
}
