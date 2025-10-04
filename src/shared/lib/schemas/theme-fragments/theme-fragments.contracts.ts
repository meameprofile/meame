// RUTA: src/shared/lib/schemas/theme-fragments/theme-fragments.contracts.ts
/**
 * @file theme-fragments.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Fragmentos de Tema.
 * @version 2.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ThemeFragmentRow = Tables<"theme_fragments">;
export type ThemeFragmentInsert = TablesInsert<"theme_fragments">;
export type ThemeFragmentUpdate = TablesUpdate<"theme_fragments">;
