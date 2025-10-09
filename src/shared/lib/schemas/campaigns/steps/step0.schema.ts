// RUTA: src/shared/lib/schemas/campaigns/steps/step0.schema.ts
/**
 * @file step0.schema.ts
 * @description SSoT para los contratos de datos del Paso 0, refactorizado para el nuevo flujo de "Punto de Partida".
 * @version 6.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// --- Contenido i18n ---
export const Step0ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  originGroupLabel: z.string(),
  originScratchLabel: z.string(),
  originTemplateLabel: z.string(),
  originCloneLabel: z.string(),
  templateSelectLabel: z.string(),
  templateSelectPlaceholder: z.string(),
  baseCampaignLabel: z.string(),
  baseCampaignPlaceholder: z.string(),
  campaignNameLabel: z.string(),
  campaignNamePlaceholder: z.string(),
  seoKeywordsLabel: z.string(),
  seoKeywordsPlaceholder: z.string(),
  seoKeywordsDescription: z.string(),
  seoKeywordsTooltip: z.object({
    trigger: z.string(),
    content: z.string(),
    linkText: z.string(),
  }),
  producerLabel: z.string(),
  producerPlaceholder: z.string(),
  campaignTypeLabel: z.string(),
  campaignTypePlaceholder: z.string(),
  passportStampLabel: z.string(),
  producerLabels: z.record(z.string()),
  campaignTypeLabels: z.record(z.string()),
});

// --- Validación del Formulario ---
export const step0Schema = z.object({
  campaignOrigin: z.enum(["scratch", "template", "clone"]),
  templateId: z.string().optional(),
  baseCampaignId: z.string().optional(),
  campaignName: z
    .string()
    .min(3, "El nombre de la campaña debe tener al menos 3 caracteres."),
  seoKeywords: z
    .array(z.string())
    .min(1, "Debes añadir al menos una palabra clave."),
  producer: z.string().min(1, "Debes seleccionar un productor."),
  campaignType: z.string().min(1, "Debes seleccionar un tipo de campaña."),
});

export type Step0Data = z.infer<typeof step0Schema>;
