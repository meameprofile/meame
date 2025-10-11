// RUTA: src/shared/hooks/campaign-suite/use-template-loader.ts
/**
 * @file use-template-loader.ts
 * @description Hook de élite para orquestar la carga de plantillas.
 * @version 9.4.0 (Routing Contract Restoration): Se corrige la clave de ruta
 *              utilizada en la redirección post-carga, alineándola con la
 *              SSoT de 'navigation.ts' y resolviendo un error crítico de build.
 * @author L.I.A. Legacy
 */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { loadTemplateAction } from "@/shared/lib/actions/campaign-suite/loadTemplate.action";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { generateDraftId } from "@/shared/lib/utils/campaign-suite/draft.utils";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";

import { useCampaignDraftStore } from "./use-campaign-draft.store";

export function useTemplateLoader(onLoadComplete?: () => void) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const firstStepId = stepsDataConfig[0].id;
  const setDraft = useCampaignDraftStore((state) => state.setDraft);

  const loadTemplate = (templateId: string, copySuffix: string) => {
    const traceId = logger.startTrace(`loadTemplate:${templateId}_v9.4`);
    const groupId = logger.startGroup(`[TemplateLoader] Orquestando carga...`);

    startTransition(async () => {
      try {
        const result = await loadTemplateAction(templateId);
        if (!result.success) throw new Error(result.error);

        const { draftData } = result.data;
        logger.traceEvent(
          traceId,
          "Datos de plantilla recibidos. Hidratando store centralizado..."
        );

        const newDraftState: CampaignDraft = {
          ...draftData,
          draftId: generateDraftId(draftData.baseCampaignId || "template"),
          campaignOrigin: "template",
          templateId: templateId,
          campaignName: `${draftData.campaignName}${copySuffix}`,
          seoKeywords: Array.isArray(draftData.seoKeywords)
            ? draftData.seoKeywords
            : [],
          completedSteps: [],
          updatedAt: new Date().toISOString(),
        };

        setDraft(newDraftState);

        logger.success("[TemplateLoader] Store centralizado hidratado.", {
          traceId,
        });
        toast.success("Plantilla cargada con éxito.");

        // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v9.4.0] ---
        // Se utiliza la clave correcta 'creatorCampaignSuiteWithStepId' y se
        // proporciona el 'stepId' requerido para navegar al inicio del wizard.
        router.push(
          routes.creatorCampaignSuiteWithStepId.path({
            locale,
            stepId: [String(firstStepId)],
          })
        );
        // --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v9.4.0] ---
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
