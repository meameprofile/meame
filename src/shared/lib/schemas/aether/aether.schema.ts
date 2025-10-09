// RUTA: src/shared/lib/schemas/aether/aether.schema.ts
/**
 * @file aether.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del motor "Aether".
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const AetherControlsContentSchema = z.object({
  playLabel: z.string(),
  pauseLabel: z.string(),
  muteLabel: z.string(),
  unmuteLabel: z.string(),
  enterFullscreenLabel: z.string(),
  exitFullscreenLabel: z.string(),
  enterPipLabel: z.string(),
  exitPipLabel: z.string(),
  expandLabel: z.string(),
  collapseLabel: z.string(),
  progressBarLabel: z.string(),
  preloaderText: z.string(),
  errorText: z.string(),
});

export const AetherLocaleSchema = z.object({
  aetherControls: AetherControlsContentSchema.optional(),
});
