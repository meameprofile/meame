// RUTA: src/shared/lib/actions/cogniread/createOrUpdateArticle.action.ts
/**
 * @file createOrUpdateArticle.action.ts
 * @description Server Action para crear o actualizar un artículo, ahora isomórfica.
 * @version 3.2.0 (Routing Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createId } from "@paralleldrive/cuid2";
import { type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { ROUTING_LOCALES } from "@/shared/lib/i18n/i18n.config"; // <-- CONTRATO CORREGIDO
import { logger } from "@/shared/lib/logging";
import {
  CogniReadArticleSchema,
  type CogniReadArticle,
} from "@/shared/lib/schemas/cogniread/article.schema";
import { createServerClient as createNextServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

type ArticleInput = Omit<
  CogniReadArticle,
  "articleId" | "createdAt" | "updatedAt"
> & {
  articleId?: string;
  createdAt?: string;
};

export async function createOrUpdateArticleAction(
  input: ArticleInput,
  supabaseOverride?: SupabaseClient
): Promise<ActionResult<{ articleId: string }>> {
  const traceId = logger.startTrace("createOrUpdateArticleAction_v3.2");
  const supabase = supabaseOverride || createNextServerClient();

  try {
    if (!supabaseOverride) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, error: "auth_required" };
    }

    const now = new Date().toISOString();
    const articleId = input.articleId || createId();

    const articleDocument: CogniReadArticle = {
      ...input,
      articleId,
      createdAt: input.createdAt || now,
      updatedAt: now,
      baviHeroImageId: input.baviHeroImageId || undefined,
      relatedPromptIds: input.relatedPromptIds || [],
    };

    const validation = CogniReadArticleSchema.safeParse(articleDocument);
    if (!validation.success) {
      return { success: false, error: "Los datos del artículo son inválidos." };
    }
    const { data: validatedData } = validation;

    const supabasePayload = {
      id: validatedData.articleId,
      status: validatedData.status,
      study_dna: validatedData.studyDna,
      content: validatedData.content,
      bavi_hero_image_id: validatedData.baviHeroImageId || null,
      related_prompt_ids: validatedData.relatedPromptIds || [],
      created_at: validatedData.createdAt,
      updated_at: validatedData.updatedAt,
    };

    const { data, error } = await supabase
      .from("cogniread_articles")
      .upsert(supabasePayload, { onConflict: "id" })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    if (!supabaseOverride) {
      revalidatePath("/news");
      // La lógica ahora usa la SSoT de enrutamiento
      for (const locale of ROUTING_LOCALES) {
        const slug = validatedData.content[locale]?.slug;
        if (slug) revalidatePath(`/${locale}/news/${slug}`);
      }
    }

    logger.success(
      `[CogniReadAction] Artículo ${data.id} guardado con éxito.`,
      { traceId }
    );
    return { success: true, data: { articleId: data.id } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[CogniReadAction] Fallo crítico al guardar el artículo.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudo guardar el artículo: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
