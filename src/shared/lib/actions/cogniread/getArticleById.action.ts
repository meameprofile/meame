// RUTA: src/shared/lib/actions/cogniread/getArticleById.action.ts
/**
 * @file getArticleById.action.ts
 * @description Server Action soberana para obtener un único artículo de CogniRead por su CUID2,
 *              ahora completamente alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 5.0.0 (Sovereign Contract Aligned)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import "server-only";
import { logger } from "@/shared/lib/logging";
import {
  CogniReadArticleSchema,
  type CogniReadArticle,
} from "@/shared/lib/schemas/cogniread/article.schema";
import type { CogniReadArticleRow } from "@/shared/lib/schemas/cogniread/cogniread.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

import { mapSupabaseToCogniReadArticle } from "./_shapers/cogniread.shapers";

export async function getArticleByIdAction(
  articleId: string
): Promise<ActionResult<{ article: CogniReadArticle | null }>> {
  const traceId = logger.startTrace("getArticleByIdAction_v5.0");
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
        logger.warn(
          `[CogniReadAction] No se encontró artículo para el ID: ${articleId}.`,
          { traceId }
        );
        return { success: true, data: { article: null } };
      }
      throw new Error(error.message);
    }

    const mappedArticle = mapSupabaseToCogniReadArticle(
      data as CogniReadArticleRow
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
