// RUTA: src/shared/hooks/campaign-suite/use-campaign-draft.hook.ts
/**
 * @file use-campaign-draft.hook.ts
 * @description Hook de interfaz soberano para interactuar con la "Forja Centralizada".
 * @version 1.0.0 (Centralized Forge Architecture)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

import { useCampaignDraftStore } from "./use-campaign-draft.store";

interface UseCampaignDraftReturn {
  draft: CampaignDraft;
  updateDraft: (data: Partial<CampaignDraft>) => void;
  resetDraft: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}

export function useCampaignDraft(): UseCampaignDraftReturn {
  const draft = useCampaignDraftStore((state) => state.draft);
  const updateDraft = useCampaignDraftStore((state) => state.updateDraft);
  const resetDraft = useCampaignDraftStore((state) => state.resetDraft);
  const isLoading = useCampaignDraftStore((state) => state.isLoading);
  const isSyncing = useCampaignDraftStore((state) => state.isSyncing);

  return { draft, updateDraft, resetDraft, isLoading, isSyncing };
}
