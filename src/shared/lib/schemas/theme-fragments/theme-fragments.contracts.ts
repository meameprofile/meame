// RUTA: src/shared/lib/schemas/theme-fragments/theme-fragments.contracts.ts
/**
 * @file theme-fragments.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Fragmentos de Tema,
 *              ahora con su schema de validación Zod.
 * @version 3.0.0 (Zod Schema Integration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ThemeFragmentRow = Tables<"theme_fragments">;
export type ThemeFragmentInsert = TablesInsert<"theme_fragments">;
export type ThemeFragmentUpdate = TablesUpdate<"theme_fragments">;

export const ThemeFragmentRowSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  type: z.enum(["color", "font", "geometry"]),
  data: z.any(), // jsonb
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
