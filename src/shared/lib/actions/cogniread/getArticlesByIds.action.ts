// RUTA: src/shared/lib/actions/cogniread/getArticlesByIds.action.ts
/**
 * @file getArticlesByIds.action.ts
 * @description Server Action de alto rendimiento para obtener un lote de artículos
 *              de CogniRead por sus IDs. Esencial para funcionalidades del ecosistema
 *              que requieren la hidratación de múltiples activos de conocimiento
 *              en una sola operación (ej. prompts relacionados, colecciones).
 * @version 4.0.0 (Architecturally Pure & Holistically Aligned)
 *@author RaZ Podestá - MetaShark Tech - Asistente de Refactorización
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

export async function getArticlesByIdsAction(
  articleIds: string[]
): Promise<ActionResult<{ articles: CogniReadArticle[] }>> {
  const traceId = logger.startTrace("getArticlesByIdsAction_v4.0_Pure");
  logger.info(
    `[CogniReadAction] Solicitando ${articleIds.length} artículos por IDs...`,
    { traceId }
  );

  const supabase = createServerClient();

  try {
    const validation = z.array(z.string().cuid2()).safeParse(articleIds);
    if (!validation.success) {
      return {
        success: false,
        error: "Uno o más de los IDs proporcionados son inválidos.",
      };
    }

    const validIds = validation.data;
    if (validIds.length === 0) {
      return { success: true, data: { articles: [] } };
    }

    const { data, error } = await supabase
      .from("cogniread_articles")
      .select("*")
      .in("id", validIds)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const mappedArticles: CogniReadArticle[] = (
      (data as SupabaseCogniReadArticle[]) || []
    ).map(mapSupabaseToCogniReadArticle);
    const validationResult = z
      .array(CogniReadArticleSchema)
      .safeParse(mappedArticles);

    if (!validationResult.success) {
      logger.error(
        "[CogniReadAction] Uno o más artículos de la base de datos están corruptos.",
        {
          errors: validationResult.error.flatten(),
          traceId,
        }
      );
      throw new Error(
        "Formato de datos de artículos inesperado desde la base de datos."
      );
    }

    return { success: true, data: { articles: validationResult.data } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    return {
      success: false,
      error: `No se pudieron recuperar los artículos de la base de datos: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
