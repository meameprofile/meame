// lib/schemas/templates/template.schema.ts
/**
 * @file template.schema.ts
 * @description SSoT para el contrato de datos de las plantillas de campaña.
 * @version 2.1.0 (Definitive SSoT Import Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Se corrige la importación para apuntar a la SSoT canónica de los schemas
// atómicos, resolviendo todos los errores de exportación.
import {
  HeaderConfigSchema,
  FooterConfigSchema,
  LayoutConfigSchema,
  ThemeConfigSchema,
  ContentDataSchema,
} from "@/shared/lib/schemas/campaigns/draft.parts.schema";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

// Metadatos de una plantilla en el manifiesto
export const TemplateMetadataSchema = z.object({
  templateId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  previewImage: z.string().optional(),
});

// Estructura completa del archivo de manifiesto
export const TemplatesManifestSchema = z.array(TemplateMetadataSchema);

// Estructura de un archivo de plantilla individual
export const CampaignTemplateSchema = z.object({
  templateId: z.string(),
  name: z.string(),
  description: z.string(),
  sourceCampaignId: z.string(),
  headerConfig: HeaderConfigSchema,
  footerConfig: FooterConfigSchema,
  layoutConfig: LayoutConfigSchema,
  themeConfig: ThemeConfigSchema,
  contentData: ContentDataSchema,
});

export type CampaignTemplate = z.infer<typeof CampaignTemplateSchema>;
export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;
// lib/schemas/templates/template.schema.ts
