// RUTA: src/shared/lib/actions/cogniread/getPublishedArticles.action.ts
/**
 * @file getPublishedArticles.action.ts
 * @description Server Action para obtener una lista paginada de artículos PUBLICADOS,
 *              ahora completamente alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 8.0.0 (Sovereign Contract Aligned)
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
import { mapSupabaseToCogniReadArticle } from "./_shapers/cogniread.shapers";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { CogniReadArticleRow } from "@/shared/lib/schemas/cogniread/cogniread.contracts";

const GetArticlesInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
type GetArticlesInput = z.infer<typeof GetArticlesInputSchema>;

async function _processArticleQuery(
  queryPromise: PromiseLike<PostgrestResponse<CogniReadArticleRow>>
): Promise<{ articles: CogniReadArticle[]; total: number }> {
  const { data, error, count } = await queryPromise;

  if (error) {
    throw new Error(error.message);
  }

  const mappedArticles: CogniReadArticle[] = (data || []).map(
    mapSupabaseToCogniReadArticle
  );

  const validation = z.array(CogniReadArticleSchema).safeParse(mappedArticles);
  if (!validation.success) {
    throw new Error(
      "Formato de datos de artículos inesperado desde la base de datos."
    );
  }

  return { articles: validation.data, total: count ?? 0 };
}

export async function getPublishedArticlesAction(
  input: GetArticlesInput
): Promise<ActionResult<{ articles: CogniReadArticle[]; total: number }>> {
  const traceId = logger.startTrace("getPublishedArticlesAction_v8.0");
  logger.info(
    `[CogniReadAction] Obteniendo artículos publicados (página ${input.page})...`,
    { traceId }
  );

  try {
    const supabase = createServerClient();
    const validatedInput = GetArticlesInputSchema.parse(input);
    const { page, limit } = validatedInput;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const query = supabase
      .from("cogniread_articles")
      .select("*", { count: "exact" })
      .eq("status", "published") // Filtro clave para esta acción
      .order("updated_at", { ascending: false })
      .range(start, end);

    const result = await _processArticleQuery(query);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[getPublishedArticlesAction] Fallo crítico.`, {
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
