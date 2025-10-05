// RUTA: src/shared/lib/schemas/theme-presets/theme-presets.contracts.ts
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ThemePresetRow = Tables<"theme_presets">;
export type ThemePresetInsert = TablesInsert<"theme_presets">;
export type ThemePresetUpdate = TablesUpdate<"theme_presets">;
export const ThemePresetRowSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  theme_config: z.any(), // jsonb
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  type: z.enum(["color", "font", "geometry"]),
});
