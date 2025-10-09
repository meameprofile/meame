// RUTA: src/shared/lib/types/campaigns/draft.types.ts
/**
 * @file draft.types.ts
 * @description SSoT para los contratos de tipos del borrador de campaña, alineado con el flujo de "Punto de Partida" del Paso 0.
 * @version 7.0.0 (Sovereign Origin Flow & Semantic Refactor)
 * @author RaZ Podestá - MetaShark Tech
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
  "[draft.types.ts] Módulo de tipos de borrador de campaña v7.0 cargado."
);

export type HeaderConfig = z.infer<typeof HeaderConfigSchema>;
export type FooterConfig = z.infer<typeof FooterConfigSchema>;
export type LayoutConfigItem = z.infer<typeof LayoutConfigSchema>[number];
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type ContentData = z.infer<typeof ContentDataSchema>;

/**
 * @interface CampaignDraft
 * @description Contrato de datos soberano para un borrador de campaña. Es la SSoT
 *              para el estado que se persiste localmente y se envía al servidor.
 */
export interface CampaignDraft {
  // --- Metadatos de Sesión ---
  draftId: string | null;
  completedSteps: number[];
  updatedAt: string;

  // --- Paso 0: Identidad y Origen ---
  campaignOrigin: "scratch" | "template" | "clone" | null;
  templateId: string | null;
  baseCampaignId: string | null;
  campaignName: string | null; // REFACTORIZADO: Anteriormente 'variantName'
  seoKeywords: string[]; // REFACTORIZADO: Anteriormente 'string | null'
  producer: string | null;
  campaignType: string | null;

  // --- Paso 1: Estructura ---
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;

  // --- Paso 2: Layout ---
  layoutConfig: LayoutConfigItem[];

  // --- Paso 3: Tema Visual ---
  themeConfig: ThemeConfig;

  // --- Paso 4: Contenido ---
  contentData: ContentData;
}

/**
 * @interface CampaignDraftState
 * @description Contrato para el store de Zustand que gestiona el borrador.
 */
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
