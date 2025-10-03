// RUTA: src/shared/lib/types/campaigns/draft.types.ts
/**
 * @file draft.types.ts
 * @description SSoT para los contratos de tipos del borrador de campaña y su estado en Zustand.
 * @version 6.0.0 (Holistic & Coherent Data Model v2)
 *@author RaZ Podestá - MetaShark Tech
 */
import type { z } from "zod";
import type {
  HeaderConfigSchema,
  FooterConfigSchema,
  LayoutConfigSchema,
  ThemeConfigSchema,
  ContentDataSchema,
} from "@/shared/lib/schemas/campaigns/draft.parts.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[draft.types.ts] Módulo de tipos de borrador de campaña v6.0 cargado."
);

export type HeaderConfig = z.infer<typeof HeaderConfigSchema>;
export type FooterConfig = z.infer<typeof FooterConfigSchema>;
export type LayoutConfigItem = z.infer<typeof LayoutConfigSchema>[number];
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type ContentData = z.infer<typeof ContentDataSchema>;

export interface CampaignDraft {
  draftId: string | null;
  completedSteps: number[];
  baseCampaignId: string | null;
  variantName: string | null;
  seoKeywords: string | null;
  producer: string | null;
  campaignType: string | null;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  layoutConfig: LayoutConfigItem[];
  themeConfig: ThemeConfig;
  contentData: ContentData;
  updatedAt: string;
}

export interface CampaignDraftState {
  draft: CampaignDraft;
  isLoading: boolean;
  isSyncing: boolean;
  initializeDraft: () => Promise<void>;
  updateDraft: (data: Partial<Omit<CampaignDraft, "draftId">>) => void;
  updateSectionContent: (
    sectionName: string,
    locale: Locale,
    field: string,
    value: unknown
  ) => void;
  setStep: (step: number) => void;
  deleteDraft: () => void;
  _debouncedSave: (draftToSave: CampaignDraft) => Promise<void>;
  _updateAndDebounce: (
    newDraftState: Partial<Omit<CampaignDraft, "draftId">>
  ) => void;
}
