// RUTA: src/shared/lib/schemas/campaigns/campaign-suite.contracts.ts
/**
 * @file campaign-suite.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de la SDC.
 * @version 2.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type CampaignDraftRow = Tables<"campaign_drafts">;
export type CampaignDraftInsert = TablesInsert<"campaign_drafts">;
export type CampaignDraftUpdate = TablesUpdate<"campaign_drafts">;

export type CampaignTemplateRow = Tables<"campaign_templates">;
export type CampaignTemplateInsert = TablesInsert<"campaign_templates">;
export type CampaignTemplateUpdate = TablesUpdate<"campaign_templates">;

export type CampaignArtifactRow = Tables<"campaign_artifacts">;
export type CampaignArtifactInsert = TablesInsert<"campaign_artifacts">;
export type CampaignArtifactUpdate = TablesUpdate<"campaign_artifacts">;
