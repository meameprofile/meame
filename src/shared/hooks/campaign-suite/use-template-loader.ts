// RUTA: src/shared/hooks/campaign-suite/use-template-loader.ts
/**
 * @file use-template-loader.ts
 * @description Hook de élite para orquestar la carga de plantillas.
 *              v9.3.0 (Absolute Type Safety): Implementa una lógica de
 *              transformación explícita y resiliente para `seoKeywords`,
 *              erradicando el error de tipo 'never' de forma definitiva.
 * @version 9.3.0
 * @author L.I.A. Legacy
 */
"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { loadTemplateAction } from "@/shared/lib/actions/campaign-suite/loadTemplate.action";
import { logger } from "@/shared/lib/logging";
import { useCampaignDraftStore } from "./use-campaign-draft.store";
import { routes } from "@/shared/lib/navigation";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";
import { generateDraftId } from "@/shared/lib/utils/campaign-suite/draft.utils";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

export function useTemplateLoader(onLoadComplete?: () => void) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const firstStepId = stepsDataConfig[0].id;
  const setDraft = useCampaignDraftStore((state) => state.setDraft);

  const loadTemplate = (templateId: string, copySuffix: string) => {
    const traceId = logger.startTrace(`loadTemplate:${templateId}_v9.3`);
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
          // --- [INICIO DE REFACTORIZACIÓN DE TIPO v9.3.0] ---
          // Se comprueba explícitamente si es un array; de lo contrario, se usa un fallback seguro.
          seoKeywords: Array.isArray(draftData.seoKeywords)
            ? draftData.seoKeywords
            : [],
          // --- [FIN DE REFACTORIZACIÓN DE TIPO v9.3.0] ---
          completedSteps: [],
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
