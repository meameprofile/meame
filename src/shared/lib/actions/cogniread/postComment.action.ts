// RUTA: src/shared/lib/actions/cogniread/postComment.action.ts
/**
 * @file postComment.action.ts
 * @description Server Action para publicar un nuevo comentario en un artículo.
 * @version 3.0.0 (Architecturally Pure)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use server";

import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  CommentSchema,
  type Comment,
} from "@/shared/lib/schemas/community/comment.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  mapSupabaseToComment,
  type SupabaseComment,
} from "./_shapers/cogniread.shapers";

interface PostCommentInput {
  articleId: string;
  commentText: string;
  parentId?: string | null;
  articleSlug: string;
}

export async function postCommentAction(
  input: PostCommentInput
): Promise<ActionResult<{ newComment: Comment }>> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "auth_required" };
  }

  try {
    const now = new Date().toISOString();
    const newCommentId = createId();

    const commentDocument: Comment = {
      commentId: newCommentId,
      articleId: input.articleId,
      userId: user.id,
      authorName:
        user.user_metadata.full_name || user.email || "Usuario Anónimo",
      authorAvatarUrl: user.user_metadata.avatar_url || undefined,
      commentText: input.commentText,
      parentId: input.parentId || null,
      createdAt: now,
      updatedAt: now,
    };

    const validation = CommentSchema.safeParse(commentDocument);
    if (!validation.success) {
      return {
        success: false,
        error: "Los datos del comentario son inválidos según el esquema.",
      };
    }

    const supabasePayload = {
      id: validation.data.commentId,
      article_id: validation.data.articleId,
      user_id: validation.data.userId,
      author_name: validation.data.authorName,
      author_avatar_url: validation.data.authorAvatarUrl,
      comment_text: validation.data.commentText,
      parent_id: validation.data.parentId,
      created_at: validation.data.createdAt,
      updated_at: validation.data.updatedAt,
    };

    const { data, error } = await supabase
      .from("community_comments")
      .insert(supabasePayload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const newComment = mapSupabaseToComment(data as SupabaseComment);
    revalidatePath(`/news/${input.articleSlug}`);

    return { success: true, data: { newComment } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    return {
      success: false,
      error: `No se pudo publicar tu comentario: ${errorMessage}`,
    };
  }
}
