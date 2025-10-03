// shared/lib/schemas/components/dev/component-canvas-header.schema.ts
/**
 * @file component-canvas-header.schema.ts
 * @description SSoT para el contrato de datos i18n del ComponentCanvasHeader.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ComponentCanvasHeaderContentSchema = z.object({
  description: z.string(),
});

export const ComponentCanvasHeaderLocaleSchema = z.object({
  componentCanvasHeader: ComponentCanvasHeaderContentSchema.optional(),
});
// shared/lib/schemas/components/dev/component-canvas-header.schema.ts
