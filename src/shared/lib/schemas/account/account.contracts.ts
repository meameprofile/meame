// RUTA: src/shared/lib/schemas/account/account.contracts.ts
/**
 * @file account.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Cuentas.
 * @version 11.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ProfilesRow = Tables<"profiles">;
export type ProfilesInsert = TablesInsert<"profiles">;
export type ProfilesUpdate = TablesUpdate<"profiles">;
