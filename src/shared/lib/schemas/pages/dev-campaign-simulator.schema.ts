// src/lib/schemas/pages/dev-campaign-simulator.schema.ts
/**
 * @file dev-campaign-simulator.schema.ts
 * @description Esquema de Zod para el contenido i18n de la página del Simulador de Campañas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DevCampaignSimulatorLocaleSchema = z.object({
  devCampaignSimulatorPage: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      campaignLabel: z.string(),
      variantLabel: z.string(),
      descriptionLabel: z.string(),
    })
    .optional(),
});
// src/lib/schemas/pages/dev-campaign-simulator.schema.ts
