// RUTA: src/shared/lib/schemas/workspaces/workspaces.contracts.ts
/**
 * @file workspaces.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Workspaces.
 * @version 2.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type WorkspaceRow = Tables<"workspaces">;
export type WorkspaceInsert = TablesInsert<"workspaces">;
export type WorkspaceUpdate = TablesUpdate<"workspaces">;

export type WorkspaceMemberRow = Tables<"workspace_members">;
export type WorkspaceMemberInsert = TablesInsert<"workspace_members">;
export type WorkspaceMemberUpdate = TablesUpdate<"workspace_members">;
