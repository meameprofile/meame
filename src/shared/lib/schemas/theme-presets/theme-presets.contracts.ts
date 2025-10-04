// RUTA: src/shared/lib/schemas/theme-presets/theme-presets.contracts.ts
/**
 * @file theme-presets.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Presets de Tema.
 * @version 3.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ThemePresetRow = Tables<"theme_presets">;
export type ThemePresetInsert = TablesInsert<"theme_presets">;
export type ThemePresetUpdate = TablesUpdate<"theme_presets">;
