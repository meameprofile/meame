// RUTA: src/shared/lib/schemas/cogniread/cogniread.contracts.ts
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type CogniReadArticleRow = Tables<"cogniread_articles">;
export type CogniReadArticleInsert = TablesInsert<"cogniread_articles">;
export type CogniReadArticleUpdate = TablesUpdate<"cogniread_articles">;
export const CogniReadArticleRowSchema = z.object({
  id: z.string(),
  status: z.string(),
  study_dna: z.any(), // jsonb
  content: z.any(), // jsonb
  tags: z.array(z.string()).nullable(),
  available_languages: z.array(z.string()).nullable(),
  bavi_hero_image_id: z.string().nullable(),
  related_prompt_ids: z.array(z.string()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CommunityCommentRow = Tables<"community_comments">;
export type CommunityCommentInsert = TablesInsert<"community_comments">;
export type CommunityCommentUpdate = TablesUpdate<"community_comments">;
export const CommunityCommentRowSchema = z.object({
  id: z.string().uuid(),
  article_id: z.string(),
  user_id: z.string().uuid(),
  author_name: z.string(),
  author_avatar_url: z.string().nullable(),
  comment_text: z.string(),
  parent_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
