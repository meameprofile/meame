// RUTA: src/shared/lib/schemas/workspaces/workspaces.contracts.ts
import { z } from "zod";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type WorkspaceRow = Tables<"workspaces">;
export type WorkspaceInsert = TablesInsert<"workspaces">;
export type WorkspaceUpdate = TablesUpdate<"workspaces">;
export const WorkspaceRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type WorkspaceMemberRow = Tables<"workspace_members">;
export type WorkspaceMemberInsert = TablesInsert<"workspace_members">;
export type WorkspaceMemberUpdate = TablesUpdate<"workspace_members">;
export const WorkspaceMemberRowSchema = z.object({
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.string(),
  created_at: z.string().datetime(),
});
