// RUTA: src/shared/lib/schemas/campaigns/draft.schema.ts
/**
 * @file draft.schema.ts
 * @description SSoT para el schema del borrador de campaña en la base de datos.
 *              v4.0.0 (Holistic & Coherent Data Model): Se alinea el contrato de
 *              datos con el estado de la aplicación, reemplazando los campos
 *              obsoletos por los nuevos campos de identidad de la campaña.
 * @version 4.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import {
  HeaderConfigSchema,
  FooterConfigSchema,
  LayoutConfigSchema,
  ThemeConfigSchema,
  ContentDataSchema,
} from "./draft.parts.schema";

export const CampaignDraftDataSchema = z.object({
  draftId: z.string(),
  baseCampaignId: z.string().nullable(),
  variantName: z.string().nullable(),
  seoKeywords: z.string().nullable(),
  producer: z.string().nullable(),
  campaignType: z.string().nullable(),
  headerConfig: HeaderConfigSchema,
  footerConfig: FooterConfigSchema,
  layoutConfig: LayoutConfigSchema,
  themeConfig: ThemeConfigSchema,
  contentData: ContentDataSchema,
  completedSteps: z.array(z.number()),
  updatedAt: z.string().datetime(),
});

export const CampaignDraftDbSchema = z.object({
  draft_id: z.string(),
  user_id: z.string(),
  workspace_id: z.string(),
  draft_data: CampaignDraftDataSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CampaignDraftDb = z.infer<typeof CampaignDraftDbSchema>;
