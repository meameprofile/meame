// RUTA: src/shared/lib/schemas/raz-prompts/raz-prompts.contracts.ts
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type RazPromptsEntryRow = Tables<"razprompts_entries">;
export type RazPromptsEntryInsert = TablesInsert<"razprompts_entries">;
export type RazPromptsEntryUpdate = TablesUpdate<"razprompts_entries">;
export const RazPromptsEntryRowSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  title: z.string(),
  status: z.string(),
  ai_service: z.string(),
  keywords: z.array(z.string()).nullable(),
  versions: z.any(), // jsonb
  tags: z.any().nullable(), // jsonb
  bavi_asset_ids: z.array(z.string()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
