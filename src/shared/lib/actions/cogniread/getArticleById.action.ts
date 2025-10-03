// RUTA: src/shared/lib/actions/cogniread/getArticleById.action.ts
/**
 * @file getArticleById.action.ts
 * @description Server Action soberana para obtener un único artículo de CogniRead por su CUID2.
 *              Esta es una acción de lectura fundamental para el ecosistema, utilizada por
 *              el editor de artículos y cualquier otro servicio que necesite un activo
 *              de conocimiento específico.
 * @version 4.0.0 (Architecturally Pure & Holistically Aligned)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import {
  CogniReadArticleSchema,
  type CogniReadArticle,
} from "@/shared/lib/schemas/cogniread/article.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import {
  mapSupabaseToCogniReadArticle,
  type SupabaseCogniReadArticle,
} from "./_shapers/cogniread.shapers";

export async function getArticleByIdAction(
  articleId: string
): Promise<ActionResult<{ article: CogniReadArticle | null }>> {
  const traceId = logger.startTrace("getArticleByIdAction_v4.0_Pure");
  logger.info(`[CogniReadAction] Obteniendo artículo por ID: ${articleId}...`, {
    traceId,
  });

  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("cogniread_articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // "PGRST116" significa "0 filas devueltas"
        logger.warn(
          `[CogniReadAction] No se encontró artículo para el ID: ${articleId}.`,
          { traceId }
        );
        return { success: true, data: { article: null } };
      }
      throw new Error(error.message);
    }

    const mappedArticle = mapSupabaseToCogniReadArticle(
      data as SupabaseCogniReadArticle
    );
    const validation = CogniReadArticleSchema.safeParse(mappedArticle);

    if (!validation.success) {
      logger.error(
        "[CogniReadAction] El artículo de la base de datos está corrupto.",
        {
          articleId,
          errors: validation.error.flatten(),
          traceId,
        }
      );
      throw new Error(
        "Formato de datos de artículo inesperado desde la base de datos."
      );
    }

    logger.success(
      `[CogniReadAction] Artículo encontrado y validado para el ID: ${articleId}.`
    );
    return { success: true, data: { article: validation.data } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[CogniReadAction] Fallo crítico al obtener artículo por ID.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: `No se pudo recuperar el artículo: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
