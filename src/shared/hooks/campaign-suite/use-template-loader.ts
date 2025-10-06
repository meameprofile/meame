// RUTA: src/shared/hooks/campaign-suite/use-template-loader.ts
/**
 * @file use-template-loader.ts
 * @description Hook de élite para orquestar la carga de plantillas.
 * @version 7.0.0 (Elite Observability & Data-Driven Navigation)
 * @author L.I.A. Legacy
 */
"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { loadTemplateAction } from "@/shared/lib/actions/campaign-suite";
import { logger } from "@/shared/lib/logging";
import { useDraftMetadataStore } from "./use-draft-metadata.store";
import { useStep0IdentityStore } from "./use-step0-identity.store";
import { useStep1StructureStore } from "./use-step1-structure.store";
import { useStep2LayoutStore } from "./use-step2-layout.store";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { useStep4ContentStore } from "./use-step4-content.store";
import { generateDraftId } from "@/shared/lib/utils/campaign-suite/draft.utils";
import { routes } from "@/shared/lib/navigation";
import { getCurrentLocaleFromPathname } from "@/shared/lib/utils/i18n/i18n.utils";
import { stepsDataConfig } from "@/shared/lib/config/campaign-suite/wizard.data.config";

export function useTemplateLoader(onLoadComplete?: () => void) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocaleFromPathname(pathname);
  const firstStepId = stepsDataConfig[0].id;

  const loadTemplate = (templateId: string, copySuffix: string) => {
    const traceId = logger.startTrace(`loadTemplate:${templateId}`);
    logger.startGroup(`[TemplateLoader] Orquestando carga v7.0...`, traceId);

    startTransition(async () => {
      try {
        const result = await loadTemplateAction(templateId);
        if (!result.success) throw new Error(result.error);

        const { draftData } = result.data;
        logger.traceEvent(
          traceId,
          "Datos de plantilla recibidos. Hidratando stores..."
        );

        useDraftMetadataStore.setState({
          baseCampaignId: draftData.baseCampaignId,
          variantName: `${draftData.variantName}${copySuffix}`,
          seoKeywords: draftData.seoKeywords,
          completedSteps: [],
          updatedAt: new Date().toISOString(),
          draftId: generateDraftId(draftData.baseCampaignId || "template"),
        });
        useStep0IdentityStore.setState({
          producer: draftData.producer,
          campaignType: draftData.campaignType,
        });
        useStep1StructureStore.setState({
          headerConfig: draftData.headerConfig,
          footerConfig: draftData.footerConfig,
        });
        useStep2LayoutStore.setState({ layoutConfig: draftData.layoutConfig });
        useStep3ThemeStore.setState({ themeConfig: draftData.themeConfig });
        useStep4ContentStore.setState({ contentData: draftData.contentData });

        logger.success("[TemplateLoader] Stores hidratados con éxito.", {
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
        logger.endGroup();
        logger.endTrace(traceId);
      }
    });
  };

  return { loadTemplate, isPending };
}
