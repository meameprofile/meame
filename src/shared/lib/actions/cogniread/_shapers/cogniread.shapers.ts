// RUTA: src/shared/lib/actions/cogniread/_shapers/cogniread.shapers.ts
/**
 * @file cogniread.shapers.ts
 * @description Módulo soberano para la transformación de datos del dominio CogniRead.
 *              v5.0.0 (Absolute Type Safety): Erradica 'any' y alinea los
 *              contratos de tipo entre la base de datos y la aplicación.
 * @version 5.0.0
 * @author L.I.A. Legacy
 */
import "server-only";
import { logger } from "@/shared/lib/logging";
import type {
  CogniReadArticle,
  StudyDna,
} from "@/shared/lib/schemas/cogniread/article.schema";
import type { Comment } from "@/shared/lib/schemas/community/comment.schema";
import type {
  CogniReadArticleRow,
  CommunityCommentRow,
} from "@/shared/lib/schemas/cogniread/cogniread.contracts";

/**
 * @function mapSupabaseToCogniReadArticle
 * @description Transforma una fila 'cogniread_articles' a la entidad 'CogniReadArticle'.
 */
export function mapSupabaseToCogniReadArticle(
  supabaseArticle: CogniReadArticleRow
): CogniReadArticle {
  logger.trace(
    `[Shaper] Transformando CogniReadArticleRow: ${supabaseArticle.id}`
  );
  return {
    articleId: supabaseArticle.id,
    status: supabaseArticle.status as CogniReadArticle["status"],
    studyDna: supabaseArticle.study_dna as StudyDna,
    content: supabaseArticle.content as CogniReadArticle["content"],
    tags: supabaseArticle.tags ?? [],
    available_languages: supabaseArticle.available_languages ?? [],
    baviHeroImageId: supabaseArticle.bavi_hero_image_id ?? undefined,
    relatedPromptIds: supabaseArticle.related_prompt_ids ?? [],
    createdAt: supabaseArticle.created_at,
    updatedAt: supabaseArticle.updated_at,
  };
}

/**
 * @function mapSupabaseToComment
 * @description Transforma una fila 'community_comments' a la entidad 'Comment'.
 */
export function mapSupabaseToComment(
  supabaseComment: CommunityCommentRow
): Comment {
  logger.trace(
    `[Shaper] Transformando CommunityCommentRow: ${supabaseComment.id}`
  );
  return {
    commentId: supabaseComment.id,
    articleId: supabaseComment.article_id,
    userId: supabaseComment.user_id,
    authorName: supabaseComment.author_name,
    authorAvatarUrl: supabaseComment.author_avatar_url ?? undefined,
    commentText: supabaseComment.comment_text,
    parentId: supabaseComment.parent_id,
    createdAt: supabaseComment.created_at,
    updatedAt: supabaseComment.updated_at,
  };
}
