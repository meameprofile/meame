// RUTA: src/shared/lib/schemas/theme-fragments/theme-fragments.contracts.ts
/**
 * @file theme-fragments.contracts.ts
 * @description SSoT para los contratos de datos del dominio de Fragmentos de Tema.
 *              Este aparato soberano centraliza los tipos para garantizar la
 *              integridad y el cumplimiento del principio DRY en todo el ecosistema.
 * @version 1.1.0 (Dependency Integrity Restoration)
 * @author L.I.A. Legacy
 */
import { z } from "zod"; // <-- DEPENDENCIA SOBERANA RESTAURADA
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

// Contrato de datos para la fila de la DB
export type ThemeFragmentRow = Tables<"theme_fragments">;
export type ThemeFragmentInsert = TablesInsert<"theme_fragments">;
export type ThemeFragmentUpdate = TablesUpdate<"theme_fragments">;

// Schema de Zod para validar un fragmento en el lado de la aplicación
export const ThemeFragmentSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
  name: z.string(),
  type: z.enum(["color", "font", "geometry"]),
  data: z.record(z.string(), z.unknown()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ThemeFragment = z.infer<typeof ThemeFragmentSchema>;

// Contrato para los fragmentos descubiertos en el sistema de archivos
export type DiscoveredFragments = {
  colors: string[];
  fonts: string[];
  radii: string[];
};

// Contrato para los fragmentos cargados en memoria
export type LoadedFragments = {
  base: Partial<AssembledTheme>;
  colors: Record<string, Partial<AssembledTheme>>;
  fonts: Record<string, Partial<AssembledTheme>>;
  radii: Record<string, Partial<AssembledTheme>>;
};
