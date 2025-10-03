// RUTA: src/shared/lib/actions/cogniread/getArticlesIndex.action.ts
/**
 * @file getArticlesIndex.action.ts
 * @description Server Action de élite para obtener un índice de versiones.
 * @version 3.1.0 (Code Hygiene)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";

type ArticleIndex = Record<string, string>;
interface SupabaseArticleIndexEntry {
  id: string;
  updated_at: string;
}

export async function getArticlesIndexAction(): Promise<
  ActionResult<ArticleIndex>
> {
  logger.info("[CogniRead Action] Solicitando índice de versiones...");
  const supabase = createServerClient();

  try {
    // --- [INICIO DE REFACTORIZACIÓN DE HIGIENE] ---
    // Se elimina la variable 'error' no utilizada en la desestructuración.
    const { data: articles } = await supabase
      .from("cogniread_articles")
      .select("id, updated_at")
      .eq("status", "published");
    // --- [FIN DE REFACTORIZACIÓN DE HIGIENE] ---

    if (!articles) return { success: true, data: {} };

    const index = articles.reduce<ArticleIndex>((acc, article) => {
      const typedArticle = article as SupabaseArticleIndexEntry;
      if (typedArticle.id && typedArticle.updated_at)
        acc[typedArticle.id] = typedArticle.updated_at;
      return acc;
    }, {});

    return { success: true, data: index };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[CogniRead Action] Fallo crítico al obtener el índice.", {
      error: errorMessage,
    });
    return {
      success: false,
      error: "No se pudo generar el índice de versiones.",
    };
  }
}
