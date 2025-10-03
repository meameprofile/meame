// RUTA: src/shared/lib/actions/cogniread/getAllArticles.action.ts
/**
 * @file getAllArticles.action.ts
 * @description Server Action para obtener una lista paginada de TODOS los artículos.
 *              v7.0.0 (Holistic & Type-Safe Refactor): Se abstrae la lógica de
 *              procesamiento de respuesta para eliminar la dependencia de tipos internos
 *              de PostgREST, resolviendo errores TS2305 y no-explicit-any.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
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
import type { PostgrestResponse } from "@supabase/supabase-js";

const GetArticlesInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
type GetArticlesInput = z.infer<typeof GetArticlesInputSchema>;

/**
 * @function _processArticleQuery
 * @description Motor interno y puro para procesar la respuesta de una consulta de artículos.
 * @private
 * @param {PromiseLike<PostgrestResponse<SupabaseCogniReadArticle>>} queryPromise - La promesa devuelta por el PostgrestBuilder.
 * @returns {Promise<{ articles: CogniReadArticle[]; total: number }>}
 */
async function _processArticleQuery(
  queryPromise: PromiseLike<PostgrestResponse<SupabaseCogniReadArticle>>
): Promise<{ articles: CogniReadArticle[]; total: number }> {
  const { data, error, count } = await queryPromise;

  if (error) {
    logger.error("[_processArticleQuery] Error en la respuesta de Supabase.", {
      error: error.message,
    });
    throw new Error(error.message);
  }

  const mappedArticles: CogniReadArticle[] = (data || []).map(
    mapSupabaseToCogniReadArticle
  );

  const validation = z.array(CogniReadArticleSchema).safeParse(mappedArticles);
  if (!validation.success) {
    logger.error("[_processArticleQuery] Los datos de la DB están corruptos.", {
      errors: validation.error.flatten(),
    });
    throw new Error(
      "Formato de datos de artículos inesperado desde la base de datos."
    );
  }

  return { articles: validation.data, total: count ?? 0 };
}

export async function getAllArticlesAction(
  input: GetArticlesInput
): Promise<ActionResult<{ articles: CogniReadArticle[]; total: number }>> {
  const traceId = logger.startTrace("getAllArticlesAction_v7.0");
  logger.info(
    `[CogniReadAction] Obteniendo todos los artículos (página ${input.page})...`,
    { traceId }
  );

  try {
    const supabase = createServerClient();
    const validatedInput = GetArticlesInputSchema.parse(input);
    const { page, limit } = validatedInput;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // --- [INICIO DE REFACTORIZACIÓN QUIRÚRGICA] ---
    // Se corrige el método .select() para usar la sintaxis correcta del SDK de Supabase,
    // eliminando la función de agregación "count()" de la cadena de selección.
    const query = supabase
      .from("cogniread_articles")
      .select("*", { count: "exact" }) // CORREGIDO: Se elimina ", count()"
      .order("updated_at", { ascending: false })
      .range(start, end);
    // --- [FIN DE REFACTORIZACIÓN QUIRÚRGICA] ---

    // Se delega el procesamiento de la respuesta al motor interno
    const result = await _processArticleQuery(query);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[getAllArticlesAction] Fallo crítico.`, {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron recuperar los artículos: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
