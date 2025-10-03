// RUTA: src/components/razBits/Dock/dock.schema.ts
/**
 * @file dock.schema.ts
 * @description SSoT para el contrato de datos del componente Dock.
 * @version 2.0.0 (Elite Export Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// --- MEJORA ARQUITECTÓNICA: Se exporta el schema de configuración ---
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
// RUTA: src/components/razBits/Dock/dock.schema.ts
