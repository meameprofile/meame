// components/razBits/Dock/dock.schema.ts
/**
 * @file dock.schema.ts
 * @description Esquema de Zod para la configuración del componente Dock.
 * @version 1.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const DockConfigSchema = z.object({
  distance: z.number().default(200),
  panelHeight: z.number().default(68),
  baseItemSize: z.number().default(50),
  dockHeight: z.number().default(256),
  magnification: z.number().default(70),
});

export const DockLocaleSchema = z.object({
  dock: z
    .object({
      config: DockConfigSchema.optional(),
    })
    .optional(),
});
// components/razBits/Dock/dock.schema.ts
