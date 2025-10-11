// RUTA: src/shared/lib/schemas/account/account.contracts.ts
import { z } from "zod";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type ProfilesRow = Tables<"profiles">;
export type ProfilesInsert = TablesInsert<"profiles">;
export type ProfilesUpdate = TablesUpdate<"profiles">;

export const ProfilesRowSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  provider_name: z.string().nullable(),
  provider_avatar_url: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_sign_in_at: z.string().datetime().nullable(),
  last_sign_in_ip: z.string().nullable(),
  last_sign_in_location: z.string().nullable(),
});
