// RUTA: src/shared/lib/actions/cogniread/getCommentsByArticleId.action.ts
/**
 * @file getCommentsByArticleId.action.ts
 * @description Server Action para obtener todos los comentarios de un artículo.
 * @version 3.0.0 (Architecturally Pure)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  CommentSchema,
  type Comment,
} from "@/shared/lib/schemas/community/comment.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import {
  mapSupabaseToComment,
  type SupabaseComment,
} from "./_shapers/cogniread.shapers";

export async function getCommentsByArticleIdAction(
  articleId: string
): Promise<ActionResult<{ comments: Comment[] }>> {
  const traceId = logger.startTrace("getCommentsByArticleIdAction_v3.0_Pure");
  logger.info(
    `[CogniReadAction] Solicitando comentarios para el artículo: ${articleId}...`,
    { traceId }
  );

  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("community_comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const mappedComments: Comment[] = ((data as SupabaseComment[]) || []).map(
      mapSupabaseToComment
    );
    const validation = z.array(CommentSchema).safeParse(mappedComments);

    if (!validation.success) {
      throw new Error(
        "Formato de datos de comentarios inesperado desde la base de datos."
      );
    }

    return { success: true, data: { comments: validation.data } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[CogniReadAction] Fallo crítico al obtener comentarios.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron recuperar los comentarios: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
