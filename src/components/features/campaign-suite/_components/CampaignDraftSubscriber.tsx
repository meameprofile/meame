// RUTA: src/components/features/campaign-suite/_components/CampaignDraftSubscriber.tsx
/**
 * @file CampaignDraftSubscriber.tsx
 * @description Componente "headless" para activar la sincronización del borrador.
 *              Su única responsabilidad es invocar el hook 'useCampaignDraftSync'.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
"use client";

import { useCampaignDraftSync } from "@/shared/hooks/campaign-suite/useCampaignDraftSync";

export function CampaignDraftSubscriber() {
  useCampaignDraftSync();
  return null; // Este componente no renderiza ninguna UI.
}
