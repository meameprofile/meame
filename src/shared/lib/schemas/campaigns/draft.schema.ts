// RUTA: src/shared/lib/schemas/campaigns/draft.schema.ts
/**
 * @file draft.schema.ts
 * @description SSoT para el schema del borrador de campaña en la base de datos.
 *              v5.0.0 (Sovereign Origin Flow Contract): Se alinea completamente
 *              con el contrato de CampaignDraft v7.0+, incorporando las propiedades
 *              `campaignOrigin`, `templateId`, `campaignName` y `seoKeywords` correctas.
 * @version 5.0.0
 * @author L.I.A. Legacy
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
  // --- Metadatos de Sesión y Progreso ---
  draftId: z.string().nullable(),
  completedSteps: z.array(z.number()),
  updatedAt: z.string().datetime(),

  // --- Paso 0: Identidad y Origen ---
  campaignOrigin: z.enum(["scratch", "template", "clone"]).nullable(),
  templateId: z.string().nullable(),
  baseCampaignId: z.string().nullable(),
  campaignName: z.string().nullable(),
  seoKeywords: z.array(z.string()),
  producer: z.string().nullable(),
  campaignType: z.string().nullable(),

  // --- Pasos Siguientes ---
  headerConfig: HeaderConfigSchema,
  footerConfig: FooterConfigSchema,
  layoutConfig: LayoutConfigSchema,
  themeConfig: ThemeConfigSchema,
  contentData: ContentDataSchema,
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
