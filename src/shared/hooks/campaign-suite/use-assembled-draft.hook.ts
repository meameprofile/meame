// RUTA: src/shared/hooks/campaign-suite/use-assembled-draft.hook.ts
/**
 * @file use-assembled-draft.hook.ts
 * @description Hook soberano y agregador de estado.
 * @version 2.0.0 (Elite Observability & Type Safety)
 * @author L.I.A. Legacy
 */
"use client";

import { useMemo } from "react";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { useDraftMetadataStore } from "./use-draft-metadata.store";
import { useStep0IdentityStore } from "./use-step0-identity.store";
import { useStep1StructureStore } from "./use-step1-structure.store";
import { useStep2LayoutStore } from "./use-step2-layout.store";
import { useStep3ThemeStore } from "./use-step3-theme.store";
import { useStep4ContentStore } from "./use-step4-content.store";

export function useAssembledDraft(): CampaignDraft {
  logger.trace("[useAssembledDraft] Hook de ensamblaje invocado (v2.0).");

  const metadata = useDraftMetadataStore();
  const identity = useStep0IdentityStore();
  const structure = useStep1StructureStore();
  const layout = useStep2LayoutStore();
  const theme = useStep3ThemeStore();
  const content = useStep4ContentStore();

  return useMemo((): CampaignDraft => {
    const traceId = logger.startTrace("assembleDraftFromStores_v2.0");
    logger.traceEvent(traceId, "Dependencias cambiaron. Re-ensamblando borrador...");

    const draft: CampaignDraft = {
      draftId: metadata.draftId, baseCampaignId: metadata.baseCampaignId,
      variantName: metadata.variantName, seoKeywords: metadata.seoKeywords,
      completedSteps: metadata.completedSteps, updatedAt: metadata.updatedAt,
      producer: identity.producer, campaignType: identity.campaignType,
      headerConfig: structure.headerConfig, footerConfig: structure.footerConfig,
      layoutConfig: layout.layoutConfig, themeConfig: theme.themeConfig,
      contentData: content.contentData,
    };

    logger.success("[useAssembledDraft] Borrador re-ensamblado con éxito.", { traceId, draftId: draft.draftId });
    logger.endTrace(traceId);
    return draft;
  }, [metadata, identity, structure, layout, theme, content]);
}
