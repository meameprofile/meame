// RUTA: src/shared/lib/schemas/campaigns/campaign-suite.contracts.ts
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type CampaignDraftRow = Tables<"campaign_drafts">;
export type CampaignDraftInsert = TablesInsert<"campaign_drafts">;
export type CampaignDraftUpdate = TablesUpdate<"campaign_drafts">;
export const CampaignDraftRowSchema = z.object({
  draft_id: z.string(),
  user_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  draft_data: z.any(), // jsonb
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CampaignTemplateRow = Tables<"campaign_templates">;
export type CampaignTemplateInsert = TablesInsert<"campaign_templates">;
export type CampaignTemplateUpdate = TablesUpdate<"campaign_templates">;
export const CampaignTemplateRowSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  source_campaign_id: z.string(),
  draft_data: z.any(), // jsonb
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CampaignArtifactRow = Tables<"campaign_artifacts">;
export type CampaignArtifactInsert = TablesInsert<"campaign_artifacts">;
export type CampaignArtifactUpdate = TablesUpdate<"campaign_artifacts">;
export const CampaignArtifactRowSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  draft_id: z.string(),
  storage_path: z.string(),
  version: z.number().int(), // <-- CORREGIDO A ENTERO
  file_size: z.number().int(), // <-- CORREGIDO A ENTERO
  created_at: z.string().datetime(),
});
