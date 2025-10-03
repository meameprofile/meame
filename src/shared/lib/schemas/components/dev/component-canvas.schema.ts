// shared/lib/schemas/components/dev/component-canvas.schema.ts
/**
 * @file component-canvas.schema.ts
 * @description SSoT para el contrato de datos i18n del ComponentCanvas.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ComponentCanvasContentSchema = z.object({
  // Textos para el estado de error cuando no se selecciona componente
  errorNoComponentTitle: z.string(),
  errorNoComponentDescription: z.string(),
  errorNoComponentLink: z.string(),
  // Textos para el estado de error cuando falla la carga del componente
  errorLoadingTitle: z.string(),
  errorLoadingDescription: z.string(),
  // Textos para el estado de éxito
  metadataPanelPropsLabel: z.string(),
});

export const ComponentCanvasLocaleSchema = z.object({
  componentCanvas: ComponentCanvasContentSchema.optional(),
});
// shared/lib/schemas/components/dev/component-canvas.schema.ts
