// RUTA: src/shared/lib/schemas/theme-preset.schema.ts
/**
 * @file theme-preset.schema.ts
 * @description SSoT para la entidad ThemePreset, con convención camelCase soberana.
 * @version 4.0.0 (Sovereign CamelCase Convention)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { ThemeConfigSchema } from "./campaigns/draft.parts.schema";

export const ThemePresetSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid().nullable(),
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.enum(["color", "font", "geometry"]),
  themeConfig: ThemeConfigSchema,
  createdAt: z.string().datetime(), // Mantener como string para consistencia con DB
  updatedAt: z.string().datetime(), // Mantener como string para consistencia con DB
});

export type ThemePreset = z.infer<typeof ThemePresetSchema>;
