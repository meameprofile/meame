// RUTA: src/shared/lib/config/campaign-suite/draft.initial-state.ts
/**
 * @file draft.initial-state.ts
 * @description SSoT para el estado inicial del borrador de campaña, ahora alineado
 *              con el contrato de tipo soberano.
 * @version 5.0.0 (Contract Aligned)
 *@author RaZ Podestá - MetaShark Tech
 */
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[draft.initial-state.ts] Módulo de estado inicial de borrador v5.0 cargado."
);

export const initialCampaignDraftState: CampaignDraft = {
  draftId: null,
  completedSteps: [],
  baseCampaignId: null,
  variantName: null,
  seoKeywords: null,
  producer: null,
  campaignType: null,
  headerConfig: { useHeader: true, componentName: null, logoPath: null },
  footerConfig: { useFooter: true, componentName: null },
  layoutConfig: [],
  themeConfig: {
    colorPreset: null,
    fontPreset: null,
    radiusPreset: null,
    themeOverrides: {},
  },
  contentData: {},
  updatedAt: new Date(0).toISOString(),
};
