// RUTA: src/shared/lib/schemas/_registry.ts
/**
 * @file _registry.ts
 * @description Manifiesto Soberano y SSoT para el mapeo entre tablas de Supabase
 *              y sus schemas de Zod de fila (`RowSchema`).
 * @version 5.0.0 (Definitive & Purified)
 * @author RaZ Podestá - MetaShark Tech
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { ProfilesRowSchema } from "./account/account.contracts";
import {
  AnonymousCampaignEventRowSchema,
  UserActivityEventRowSchema,
  VisitorCampaignEventRowSchema,
  VisitorSessionRowSchema,
} from "./analytics/analytics.contracts";
import {
  BaviAssetRowSchema,
  BaviVariantRowSchema,
} from "./bavi/bavi.contracts";
import {
  CampaignArtifactRowSchema,
  CampaignDraftRowSchema,
  CampaignTemplateRowSchema,
} from "./campaigns/campaign-suite.contracts";
import {
  CogniReadArticleRowSchema,
  CommunityCommentRowSchema,
} from "./cogniread/cogniread.contracts";
import { RazPromptsEntryRowSchema } from "./raz-prompts/raz-prompts.contracts";
import { ThemePresetRowSchema } from "./theme-presets/theme-presets.contracts";
import {
  WorkspaceMemberRowSchema,
  WorkspaceRowSchema,
} from "./workspaces/workspaces.contracts";

export const schemaRegistry: Record<string, z.ZodObject<any>> = {
  profiles: ProfilesRowSchema,
  workspaces: WorkspaceRowSchema,
  workspace_members: WorkspaceMemberRowSchema,
  bavi_assets: BaviAssetRowSchema,
  bavi_variants: BaviVariantRowSchema,
  cogniread_articles: CogniReadArticleRowSchema,
  community_comments: CommunityCommentRowSchema,
  razprompts_entries: RazPromptsEntryRowSchema,
  campaign_drafts: CampaignDraftRowSchema,
  campaign_templates: CampaignTemplateRowSchema,
  campaign_artifacts: CampaignArtifactRowSchema,
  theme_presets: ThemePresetRowSchema,
  visitor_sessions: VisitorSessionRowSchema,
  visitor_campaign_events: VisitorCampaignEventRowSchema,
  anonymous_campaign_events: AnonymousCampaignEventRowSchema,
  user_activity_events: UserActivityEventRowSchema,
};
