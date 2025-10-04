// RUTA: src/shared/lib/schemas/raz-prompts/raz-prompts.contracts.ts
/**
 * @file raz-prompts.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de RaZPrompts.
 * @version 2.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type RazPromptsEntryRow = Tables<"razprompts_entries">;
export type RazPromptsEntryInsert = TablesInsert<"razprompts_entries">;
export type RazPromptsEntryUpdate = TablesUpdate<"razprompts_entries">;
