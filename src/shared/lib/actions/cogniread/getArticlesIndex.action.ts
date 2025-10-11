// RUTA: src/shared/lib/actions/cogniread/getArticlesIndex.action.ts
/**
 * @file getArticlesIndex.action.ts
 * @description Server Action de élite para obtener un índice de versiones,
 *              ahora completamente alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 4.0.0 (Sovereign Contract Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { logger } from "@/shared/lib/logging";
import type { CogniReadArticleRow } from "@/shared/lib/schemas/cogniread/cogniread.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

type ArticleIndex = Record<string, string>;

export async function getArticlesIndexAction(): Promise<
  ActionResult<ArticleIndex>
> {
  const traceId = logger.startTrace("getArticlesIndexAction_v4.0");
  logger.info("[CogniRead Action] Solicitando índice de versiones...", {
    traceId,
  });
  const supabase = createServerClient();

  try {
    const { data: articles } = await supabase
      .from("cogniread_articles")
      .select("id, updated_at")
      .eq("status", "published");

    if (!articles) {
      logger.warn(
        "[CogniRead Action] No se encontraron artículos publicados.",
        {
          traceId,
        }
      );
      return { success: true, data: {} };
    }

    const index = (
      articles as Pick<CogniReadArticleRow, "id" | "updated_at">[]
    ).reduce<ArticleIndex>((acc, article) => {
      if (article.id && article.updated_at) {
        acc[article.id] = article.updated_at;
      }
      return acc;
    }, {});

    logger.success(
      "[CogniRead Action] Índice de versiones generado con éxito.",
      { traceId }
    );
    return { success: true, data: index };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[CogniRead Action] Fallo crítico al obtener el índice.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo generar el índice de versiones.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
