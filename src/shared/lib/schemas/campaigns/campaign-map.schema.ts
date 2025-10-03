// lib/schemas/campaigns/campaign-map.schema.ts
/**
 * @file campaign-map.schema.ts
 * @description SSoT para el contrato de datos del manifiesto de mapeo `campaign.map.json`.
 *              - v5.0.0 (Theming Soberano): Reemplaza la clave `preset` por `theme`,
 *                que ahora valida la nueva Nomenclatura Estructurada de Trazos (NET).
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Schema] Definiendo el contrato para `campaign.map.json` v5.0..."
);

/**
 * @const CampaignVariantMapSchema
 * @description Valida la configuración de una única variante de campaña dentro del mapa.
 */
export const CampaignVariantMapSchema = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string().refine((s) => s.startsWith("./content/"), {
    message: "La ruta de contenido debe empezar con './content/'",
  }),
  // La clave 'theme' es ahora la SSoT para la identidad visual de la variante.
  // Valida una cadena de texto que seguirá la Nomenclatura Estructurada de Trazos (NET).
  theme: z.string(),
  variantSlug: z.string(),
  seoKeywordSlug: z.string(),
  // themeOverrides sigue siendo un objeto opcional para anulaciones finas.
  themeOverrides: z.record(z.any()).optional(),
});

/**
 * @const CampaignMapSchema
 * @description El schema principal que valida la estructura completa del archivo `campaign.map.json`.
 */
export const CampaignMapSchema = z.object({
  productId: z.string(),
  campaignName: z.string(),
  description: z.string(),
  variants: z.record(CampaignVariantMapSchema),
});

/**
 * @type CampaignMap
 * @description Tipo inferido para un manifiesto de mapeo completo y validado.
 */
export type CampaignMap = z.infer<typeof CampaignMapSchema>;

/**
 * @type CampaignVariantMap
 * @description Tipo inferido para el objeto de una variante individual dentro del mapa.
 */
export type CampaignVariantMap = z.infer<typeof CampaignVariantMapSchema>;
// lib/schemas/campaigns/campaign-map.schema.ts
