// RUTA: src/shared/lib/config/campaign-suite/draft.initial-state.ts
/**
 * @file draft.initial-state.ts
 * @description SSoT para el estado inicial del borrador de campaña, alineado con el contrato v7.0.
 * @version 7.0.0 (Sovereign Origin Flow Contract)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

logger.trace(
  "[draft.initial-state.ts] Módulo de estado inicial de borrador v7.0 cargado."
);

export const initialCampaignDraftState: CampaignDraft = {
  draftId: null,
  completedSteps: [],
  // --- REFACTORIZACIÓN SEMÁNTICA ---
  campaignOrigin: "scratch",
  templateId: null,
  baseCampaignId: null,
  campaignName: null,
  seoKeywords: [],
  // --- FIN REFACTORIZACIÓN ---
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
