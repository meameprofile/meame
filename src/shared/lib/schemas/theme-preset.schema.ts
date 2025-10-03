// RUTA: src/shared/lib/schemas/theme-preset.schema.ts
/**
 * @file theme-preset.schema.ts
 * @description SSoT para la entidad ThemePreset.
 * @version 2.0.0 (Type Property Integration)
 *@author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { ThemeConfigSchema } from "./campaigns/draft.parts.schema";

export const ThemePresetSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  // Se añade la propiedad 'type' para categorizar el preset.
  type: z.enum(["color", "font", "geometry"]),
  // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  theme_config: ThemeConfigSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ThemePreset = z.infer<typeof ThemePresetSchema>;
