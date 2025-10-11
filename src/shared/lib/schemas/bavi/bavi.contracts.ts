// RUTA: src/shared/lib/schemas/bavi/bavi.contracts.ts
import { z } from "zod";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type BaviAssetRow = Tables<"bavi_assets">;
export type BaviAssetInsert = TablesInsert<"bavi_assets">;
export type BaviAssetUpdate = TablesUpdate<"bavi_assets">;
export const BaviAssetRowSchema = z.object({
  asset_id: z.string(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.string(),
  provider: z.string(),
  description: z.string().nullable(),
  prompt_id: z.string().nullable(),
  tags: z.any().nullable(), // jsonb
  metadata: z.any().nullable(), // jsonb
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type BaviVariantRow = Tables<"bavi_variants">;
export type BaviVariantInsert = TablesInsert<"bavi_variants">;
export type BaviVariantUpdate = TablesUpdate<"bavi_variants">;
export const BaviVariantRowSchema = z.object({
  variant_id: z.string(),
  asset_id: z.string(),
  public_id: z.string(),
  state: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  created_at: z.string().datetime(),
});
