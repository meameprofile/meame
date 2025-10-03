// RUTA: src/shared/lib/actions/cogniread/_shapers/cogniread.shapers.ts
/**
 * @file cogniread.shapers.ts
 * @description Módulo soberano para las funciones de transformación ("shaping")
 *              de datos del dominio CogniRead. Es una utilidad pura del lado del servidor.
 *              v2.1.0 (Holistic & Coherent): Se añade el mapeo para `available_languages`
 *              para una sincronización total con el schema de la base de datos.
 * @version 2.1.0
 * @author L.I.A. Legacy
 */
import "server-only";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import type { Comment } from "@/shared/lib/schemas/community/comment.schema";

// --- Contratos para Artículos ---

export interface SupabaseStudyDna {
  originalTitle: string;
  authors: string[];
  institution: string;
  publication: string;
  publicationDate: string;
  doi: string;
  fundingSource: string;
  objective: string;
  studyType: string;
  methodologySummary: string;
  mainResults: string;
  authorsConclusion: string;
  limitations: string[];
}

export interface SupabaseArticleTranslation {
  title: string;
  slug: string;
  summary: string;
  body: string;
}

export interface SupabaseCogniReadArticle {
  id: string;
  status: "draft" | "published" | "archived";
  study_dna: SupabaseStudyDna;
  content: Record<string, SupabaseArticleTranslation>;
  tags: string[] | null;
  available_languages: string[] | null;
  bavi_hero_image_id: string | null;
  related_prompt_ids: string[] | null;
  created_at: string;
  updated_at: string;
}

export function mapSupabaseToCogniReadArticle(
  supabaseArticle: SupabaseCogniReadArticle
): CogniReadArticle {
  return {
    articleId: supabaseArticle.id,
    status: supabaseArticle.status,
    studyDna: supabaseArticle.study_dna,
    content: supabaseArticle.content,
    tags: supabaseArticle.tags ?? [],
    // --- [INICIO DE CORRECCIÓN DE SINCRONIZACIÓN] ---
    available_languages: supabaseArticle.available_languages ?? [],
    // --- [FIN DE CORRECCIÓN DE SINCRONIZACIÓN] ---
    baviHeroImageId: supabaseArticle.bavi_hero_image_id ?? undefined,
    relatedPromptIds: supabaseArticle.related_prompt_ids ?? [],
    createdAt: supabaseArticle.created_at,
    updatedAt: supabaseArticle.updated_at,
  };
}

// --- Contratos para Comentarios ---

export interface SupabaseComment {
  id: string;
  article_id: string;
  user_id: string;
  author_name: string;
  author_avatar_url: string | null;
  comment_text: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export function mapSupabaseToComment(
  supabaseComment: SupabaseComment
): Comment {
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
