// RUTA: src/shared/lib/schemas/campaigns/steps/step0.schema.ts
/**
 * @file step0.schema.ts
 * @description SSoT para los contratos de datos del Paso 0, ahora con
 *              modularización de proveedores y tipos de campaña.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// --- Contenido i18n ---
export const Step0ContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Campos existentes
  baseCampaignLabel: z.string(),
  baseCampaignPlaceholder: z.string(),
  baseCampaignDescription: z.string(),
  variantNameLabel: z.string(),
  variantNamePlaceholder: z.string(),
  seoKeywordsLabel: z.string(),
  seoKeywordsPlaceholder: z.string(),
  seoKeywordsDescription: z.string(),
  // --- Nuevos Campos para Modularización ---
  producerLabel: z.string(),
  producerPlaceholder: z.string(),
  campaignTypeLabel: z.string(),
  campaignTypePlaceholder: z.string(),
  // --- Fin Nuevos Campos ---
  passportStampLabel: z.string(),
});

// --- Validación del Formulario ---
export const step0Schema = z.object({
  baseCampaignId: z.string().min(1, "Debes seleccionar una campaña base."),
  variantName: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  seoKeywords: z.string().min(5, "Debes añadir al menos una palabra clave."),
  // --- Nuevos Campos de Validación ---
  producer: z.string().min(1, "Debes seleccionar un proveedor."),
  campaignType: z.string().min(1, "Debes seleccionar un tipo de campaña."),
});

export type Step0Data = z.infer<typeof step0Schema>;
